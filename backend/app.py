# app.py
import os
import random
import hashlib
import uuid
import asyncio
from datetime import datetime, timedelta

from bson import ObjectId
from flask import (
    Flask, request, jsonify, render_template
)
from flask_cors import CORS
from motor.motor_asyncio import AsyncIOMotorClient
from itsdangerous import URLSafeTimedSerializer

from sib_api_v3_sdk import ApiClient, Configuration, TransactionalEmailsApi, SendSmtpEmail
from sib_api_v3_sdk.rest import ApiException

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    get_csrf_token,
    get_jwt
)

# -------------------
# Configuration
# -------------------
SECRET_KEY = os.getenv("SECRET_KEY", "MYSECRETKEY123")
MONGO_URI = os.getenv("MONGO_URI")
BERVO_KEY = os.getenv("BERVO_KEY")
EXPECTED_API_KEY = os.getenv("EXPECTED_API_KEY")

app = Flask(__name__, template_folder="templates")
app.secret_key = SECRET_KEY

# JWT cookie config - change JWT_COOKIE_SECURE=True in production (HTTPS)
app.config.update(
    JWT_SECRET_KEY=SECRET_KEY,
    JWT_TOKEN_LOCATION=["cookies"],
    JWT_ACCESS_COOKIE_PATH="/",
    JWT_REFRESH_COOKIE_PATH="/auth/refresh",
    JWT_COOKIE_CSRF_PROTECT=True,
    JWT_COOKIE_SECURE=True,             # True in production (requires HTTPS)
    JWT_COOKIE_SAMESITE="None",
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=10),
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=7),
)

CORS(app, supports_credentials=True, origins=[
    "https://superlative-cascaron-a3921e.netlify.app",
    "http://localhost:5173"
],
  expose_headers=["X-CSRF-Token","Time-Left"])

jwt = JWTManager(app)
serializer = URLSafeTimedSerializer(SECRET_KEY)

# -------------------
# DB (Motor)
# -------------------
if not MONGO_URI:
    raise RuntimeError("MONGO_URI env var is required")
client = AsyncIOMotorClient(MONGO_URI)
db = client["tournament_organizer"]

# -------------------
# Email (Sendinblue / Bervo)
# -------------------
configuration = Configuration()
configuration.api_key['api-key'] = BERVO_KEY
api_instance = TransactionalEmailsApi(ApiClient(configuration))

# -------------------
# Helpers
# -------------------

def get_time_left():
    jwt_data= get_jwt()
    exp = jwt_data["exp"]
    time_left = exp - int(datetime.now().timestamp())
    return time_left



def hashpassword(pwd: str):
    return hashlib.sha256(pwd.encode()).hexdigest()

def generate_otp(length=6):
    return ''.join(str(random.randint(0, 9)) for _ in range(length))

async def send_otp_email(to_email: str, otp: str, username: str):
    """
    send_transac_email is blocking in the SDK, so run in thread to avoid blocking event loop.
    """
    email = SendSmtpEmail(
        sender={"name": "TOURNAMENT ORGANIZER", "email": "ignitozgaming@gmail.com"},
        to=[{"email": to_email}],
        subject="Your OTP Code",
        html_content=render_template("otp_template.html", OTP_CODE=otp, USERNAME=username)
    )

    def _send():
        try:
            return api_instance.send_transac_email(email)
        except ApiException as e:
            raise

    try:
        # run blocking send in threadpool
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _send)
        return {"status": "success", "message": "OTP email sent!"}
    except ApiException as e:
        return {"status": "error", "message": str(e)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# -------------------
# Middleware: API key check
# -------------------
@app.before_request
def global_auth_check():
    # endpoints that should bypass API key check
    exempt_endpoints = {
        'health', 'home',
        'signup', 'host_signup',
        'login', 'host_login',
        'static', 'openapi'  # allow static files etc.
    }
    # For OPTIONS and exempt endpoints skip
    if request.method == "OPTIONS":
        return

    endpoint = (request.endpoint or "").split('.')[-1]
    if endpoint in exempt_endpoints:
        return

    api_key = request.headers.get('x-api-key')
    if api_key:
        api_key = hashlib.sha256(api_key.encode()).hexdigest()
    if not api_key or api_key != EXPECTED_API_KEY:
        return jsonify({"message": "Unauthorized"}), 401

# -------------------
# Auth & User endpoints
# -------------------

@app.route("/auth/signup", methods=["POST", "OPTIONS"])
async def signup():
    data = await request.get_json()
    required_keys = ["username", "email", "phone", "password"]
    missing = [k for k in required_keys if k not in (data or {})]
    if missing:
        return jsonify({"status": "error", "message": f"Missing keys: {missing}"}), 400

    username = data["username"]
    email = data["email"]
    phone = data["phone"]
    password = hashpassword(data["password"])

    # Check duplicates across user collection
    query = {"$or": [{"username": username}, {"email": email}, {"phone": phone}]}
    existing = await db.user_details.find_one(query)
    if existing:
        return jsonify({"status": "error", "message": "User with one of these details already exists"}), 409

    user_doc = {
        "username": username,
        "email": email,
        "phone": phone,
        "password": password,
        "Verified": False,
        "created_at": datetime.now()
    }
    await db.user_details.insert_one(user_doc)
    return jsonify({"status": "success", "message": "User registered"}), 201


@app.route("/auth/host_signup", methods=["POST", "OPTIONS"])
async def host_signup():
    data = await request.get_json()
    required_keys = ["username", "email", "phone", "password"]
    missing = [k for k in required_keys if k not in (data or {})]
    if missing:
        return jsonify({"status": "error", "message": f"Missing keys: {missing}"}), 400

    username = data["username"]
    email = data["email"]
    phone = data["phone"]
    password = hashpassword(data["password"])

    query = {"$or": [{"username": username}, {"email": email}, {"phone": phone}]}
    existing = await db.host_details.find_one(query)
    if existing:
        return jsonify({"status": "error", "message": "Host with one of these details already exists"}), 409

    host_doc = {
        "username": username,
        "email": email,
        "phone": phone,
        "password": password,
        "inviteCode": uuid.uuid4().hex[:12],
        "Verified": False,
        "created_at": datetime.now()
    }
    await db.host_details.insert_one(host_doc)
    return jsonify({"status": "success", "message": "Host registered"}), 201


@app.route("/auth/login", methods=["POST"])
async def login():
    data = await request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"status": "error", "message": "Missing credentials"}), 400

    hashed = hashpassword(password)
    user = await db.user_details.find_one({"email": email, "password": hashed})
    if not user:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    identity = {"id": str(user["_id"]), "role": "user"}
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)
    user.pop("password", None)
    resp = jsonify({"status": "success", "message": "Logged in", "role": "user","details":user,"isAuthenticated":True})
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    # optionally return CSRF token for front-end to include in header of subsequent requests
    resp.headers["X-CSRF-Token"] = get_csrf_token(access_token)
    resp.headers["Time-Left"] = get_time_left()
    return resp, 200


@app.route("/auth/host_login", methods=["POST"])
async def host_login():
    data = await request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"status": "error", "message": "Missing credentials"}), 400

    hashed = hashpassword(password)
    host = await db.host_details.find_one({"email": email, "password": hashed})
    if not host:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

    identity = {"id": str(host["_id"]), "role": "host"}
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)
    host.pop("password", None)
    resp = jsonify({"status": "success", "message": "Logged in", "role": "host","details":host,"isAuthenticated":True})
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    resp.headers["X-CSRF-Token"] = get_csrf_token(access_token)
    resp.headers["Time-Left"] = get_time_left()
    return resp, 200


@app.route("/auth/logout", methods=["POST", "OPTIONS"])
async def logout():
    resp = jsonify({"status": "success", "message": "Logged out", "isAuthenticated": False})
    unset_jwt_cookies(resp)
    return resp, 200


# Refresh endpoint to mint new access token using refresh cookie
@app.route("/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
async def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    resp = jsonify({"status": "success", "message": "Token refreshed"})
    set_access_cookies(resp, access_token)
    resp.headers["X-CSRF-Token"] = get_csrf_token(access_token)
    resp.headers["Time-Left"] = get_time_left()
    return resp, 200

# Protected user info
@app.route("/auth/me", methods=["GET"])
@jwt_required()
async def me():
    identity = get_jwt_identity()
    user_id = identity.get("id")
    role = identity.get("role")
    #access_token = create_access_token(identity=identity)
    collection = db.user_details if role == "user" else db.host_details
    user = await collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    user["_id"] = str(user["_id"])
    # Do not return password
    user.pop("password", None)
    resp = jsonify({"status": "success", "details": user, "role": role,"isAuthenticated":True})
    resp.headers["Time-Left"] = get_time_left()
    #set_access_cookies(resp, access_token)
    #resp.headers["X-CSRF-Token"] = get_csrf_token(access_token)
    return resp, 200

# -------------------
# OTP endpoints
# -------------------
@app.route("/auth/generate_otp", methods=["GET"])
@jwt_required()
async def gen_email_with_otp():
    identity = get_jwt_identity()
    user_id = identity.get("id")
    role = identity.get("role")

    collection = db.user_details if role == "user" else db.host_details
    user = await collection.find_one({"_id": ObjectId(user_id)}, {"email": 1, "username": 1})
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    otp = generate_otp()
    expiry_time = datetime.now() + timedelta(minutes=5)

    await collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"otp": otp, "otp_expiry": expiry_time}}
    )

    res = await send_otp_email(user["email"], otp, user.get("username", "User"))
    if res["status"] == "success":
        resp = jsonify({"status": "success", "message": "OTP generated and email sent"})
        resp.headers["Time-Left"] = get_time_left()
        return resp, 200
    else:
        resp = jsonify({"status": "error", "message": res["message"]}), 500
        resp.headers["Time-Left"] = get_time_left()
        return resp,500


@app.route("/auth/verify_otp", methods=["POST"])
@jwt_required()
async def verify_otp():
    data = await request.get_json()
    otp = (data or {}).get("otp")
    if not otp:
        resp = jsonify({"status": "error", "message": "Missing otp"})
        resp.headers["Time-Left"] = get_time_left()
        return resp,400

    identity = get_jwt_identity()
    user_id = identity.get("id")
    role = identity.get("role")
    collection = db.user_details if role == "user" else db.host_details
    user = await collection.find_one({"_id": ObjectId(user_id)})

    if not user or "otp" not in user or "otp_expiry" not in user:
        resp = jsonify({"status": "error", "message": "OTP not found. Please generate a new one."})
        resp.headers["Time-Left"] = get_time_left()
        return resp,404

    if datetime.now() > user["otp_expiry"]:
        resp = jsonify({"status": "error", "message": "OTP has expired. Please generate a new one."}), 400
        resp.headers["Time-Left"] = get_time_left()
        return resp,400

    if user["otp"] != otp:
        resp = jsonify({"status": "error", "message": "Invalid OTP."})
        resp.headers["Time-Left"] = get_time_left()
        return resp,400

    # OTP is valid: mark verified and remove otp fields
    await collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"Verified": True}, "$unset": {"otp": "", "otp_expiry": ""}}
    )
    resp = jsonify({"status": "success", "message": "OTP verified successfully."})
    resp.headers["Time-Left"] = get_time_left()
    return resp, 200

# -------------------
# Health & root
# -------------------
@app.route("/health", methods=["GET"])
async def health():
    return jsonify({"status": "success", "message": "API is healthy"}), 200

@app.route("/", methods=["GET"])
async def home():
    return jsonify({"status": "success", "message": "Welcome to the Tournament Organizer API"}), 200

# -------------------
# Error handler for JWT (optional customization)
# -------------------
from flask_jwt_extended.exceptions import NoAuthorizationError
@app.errorhandler(NoAuthorizationError)
def handle_no_auth(e):
    return jsonify({"status": "error", "message": "Missing or invalid token"}), 401

# -------------------
# Run (development)
# -------------------
if __name__ == "__main__":
    # Flask will accept async view functions on recent versions.
    # In production, run with an ASGI server (hypercorn/uvicorn) for best performance.
    app.run()
