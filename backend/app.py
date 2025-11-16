# main.py
import os
import random
import hashlib
import uuid
import asyncio
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from bson import ObjectId
from fastapi import (
    FastAPI, Request, Depends, HTTPException, status, Response, Header
)
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates

from motor.motor_asyncio import AsyncIOMotorClient
from itsdangerous import URLSafeTimedSerializer

from sib_api_v3_sdk import ApiClient, Configuration, TransactionalEmailsApi, SendSmtpEmail
from sib_api_v3_sdk.rest import ApiException

import jwt  # PyJWT
from jwt import PyJWTError

# -------------------
# Configuration
# -------------------
SECRET_KEY = os.getenv("SECRET_KEY", "MY_SECRET_KEY_123")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = int(os.getenv("JWT_ACCESS_MINUTES", "10"))
REFRESH_TOKEN_EXPIRES_DAYS = int(os.getenv("JWT_REFRESH_DAYS", "7"))

MONGO_URI = os.getenv("MONGO_URI")
BERVO_KEY = os.getenv("BERVO_KEY")
# EXPECTED_API_KEY should be stored hashed (sha256 hex) if you want to compare hashed value.
EXPECTED_API_KEY = os.getenv("EXPECTED_API_KEY")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI env var is required")

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# CORS (allow your frontends)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://superlative-cascaron-a3921e.netlify.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-CSRF-Token", "Time-Left"],
)

# Email (Sendinblue / Bervo)
configuration = Configuration()
configuration.api_key["api-key"] = BERVO_KEY
api_instance = TransactionalEmailsApi(ApiClient(configuration))
serializer = URLSafeTimedSerializer(SECRET_KEY)

# Mongo client
client = AsyncIOMotorClient(MONGO_URI)
db = client["tournament_organizer"]

# -------------------
# Helpers (password, otp, jwt)
# -------------------
def hashpassword(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

def generate_otp(length: int = 6) -> str:
    return "".join(str(random.randint(0, 9)) for _ in range(length))

async def send_otp_email(to_email: str, otp: str, username: str):
    """Send email in thread to avoid blocking the event loop."""
    html = templates.get_template("otp_template.html").render(OTP_CODE=otp, USERNAME=username)
    email = SendSmtpEmail(
        sender={"name": "TOURNAMENT ORGANIZER", "email": "ignitozgaming@gmail.com"},
        to=[{"email": to_email}],
        subject="Your OTP Code",
        html_content=html,
    )

    def _send():
        try:
            return api_instance.send_transac_email(email)
        except ApiException as e:
            raise

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _send)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def _now_ts() -> int:
    return int(datetime.now().timestamp())

def create_access_token(identity: Dict[str, Any]) -> str:
    """
    identity: {"id": str, "role": "user" | "host"}
    """
    expires = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    csrf = uuid.uuid4().hex

    payload = {
        "sub": identity["id"],   # MUST be string
        "role": identity["role"],  # Extra info
        "csrf": csrf,
        "type": "access",
        "exp": expires,
        "iat": datetime.now(),
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

def create_refresh_token(identity: Dict[str, Any]) -> str:
    expires = datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRES_DAYS)

    payload = {
        "sub": identity["id"],       # MUST be a string
        "role": identity["role"],    # store role separately
        "type": "refresh",
        "exp": expires,
        "iat": datetime.now(),
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_time_left_from_payload(payload: Dict[str, Any]) -> int:
    exp = payload.get("exp")
    if not exp:
        return 0
    return int(exp) - _now_ts()

# -------------------
# API-Key Middleware
# -------------------
@app.middleware("http")
async def api_key_middleware(request: Request, call_next):
    exempt_routes = {
        "/health", "/", "/auth/signup", "/auth/host_signup", "/auth/login",
        "/auth/host_login", "/openapi.json"
    }

    if request.url.path in exempt_routes or request.method == "OPTIONS":
        return await call_next(request)

    api_key = request.headers.get("x-api-key")
    if api_key:
        api_key = hashlib.sha256(api_key.encode()).hexdigest()

    # If EXPECTED_API_KEY unset, allow (helpful in dev). But you can enforce by setting env.
    if EXPECTED_API_KEY:
        if not api_key or api_key != EXPECTED_API_KEY:
            return JSONResponse(status_code=401, content={"message": "Unauthorized"})

    return await call_next(request)

# -------------------
# Auth utilities (depends)
# -------------------
def require_csrf(token_payload: dict, header_csrf: Optional[str]):
    token_csrf = token_payload.get("csrf")
    if not token_csrf or not header_csrf or header_csrf != token_csrf:
        raise HTTPException(status_code=403, detail="CSRF token missing or invalid")

async def get_current_identity(
    request: Request, 
    x_csrf_token: Optional[str] = Header(None)
):
    """
    Reads access token from cookies, verifies CSRF,
    returns (payload, identity_dict)
    """

    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Missing access token")

    payload = decode_token(access_token)

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")

    # CSRF verification
    require_csrf(payload, x_csrf_token)

    # Extract user_id + role
    user_id = payload.get("sub")
    role = payload.get("role")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    identity = {
        "id": user_id,
        "role": role
    }

    return payload, identity
# -------------------
# Routes
# -------------------
@app.post("/auth/signup",status_code=201)
async def signup(request: Request):
    data = await request.json()
    required = ["username", "email", "phone", "password"]
    if any(k not in data for k in required):
        raise HTTPException(status_code=400, detail=f"Missing fields. Required: {required}")

    query = {"$or": [{"username": data["username"]}, {"email": data["email"]}, {"phone": data["phone"]}]}
    if await db.user_details.find_one(query):
        raise HTTPException(status_code=409, detail="User already exists")

    await db.user_details.insert_one({
        "username": data["username"],
        "email": data["email"],
        "phone": data["phone"],
        "password": hashpassword(data["password"]),
        "Verified": False,
        "created_at": datetime.now()
    })
    return {"status": "success", "message": "User registered"}

@app.post("/auth/host_signup",status_code=201)
async def host_signup(request: Request):
    data = await request.json()
    required = ["username", "email", "phone", "password"]
    if any(k not in data for k in required):
        raise HTTPException(status_code=400, detail=f"Missing fields. Required: {required}")

    query = {"$or": [{"username": data["username"]}, {"email": data["email"]}, {"phone": data["phone"]}]}
    if await db.host_details.find_one(query):
        raise HTTPException(status_code=409, detail="Host already exists")

    await db.host_details.insert_one({
        "username": data["username"],
        "email": data["email"],
        "phone": data["phone"],
        "password": hashpassword(data["password"]),
        "inviteCode": uuid.uuid4().hex[:12],
        "Verified": False,
        "created_at": datetime.now()
    })
    return {"status": "success", "message": "Host registered"}

@app.post("/auth/login")
async def login(response: Response, request: Request):
    data = await request.json()
    email = data.get("email")
    pwd = data.get("password")
    if not email or not pwd:
        raise HTTPException(status_code=400, detail="Missing credentials")

    user = await db.user_details.find_one({"email": email, "password": hashpassword(pwd)})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    identity = {"id": str(user["_id"]), "role": "user"}
    access = create_access_token(identity)
    refresh = create_refresh_token(identity)

    # set cookies:
    # access_token: HttpOnly, secure, SameSite=None
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        secure=True,
        samesite="none",
        path="/"
    )
    # csrf cookie (not HttpOnly) so front-end JS can read and add to header
    payload = jwt.decode(access, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    csrf = payload.get("csrf")
    if csrf:
        response.set_cookie(
            key="csrf_access",
            value=csrf,
            httponly=False,
            secure=True,
            samesite="none",
            path="/"
        )

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=True,
        samesite="none",
        path="/auth/refresh"
    )

    user.pop("password", None)
    response.status_code = 200
    response.headers["X-CSRF-Token"] = csrf or ""
    response.headers["Time-Left"] = str(get_time_left_from_payload(payload))
    user["_id"] = str(user["_id"])
    return {"status": "success", "message": "Logged in", "role": "user", "details": user, "isAuthenticated": True}

@app.post("/auth/host_login")
async def host_login(response: Response, request: Request):
    data = await request.json()
    email = data.get("email")
    pwd = data.get("password")
    if not email or not pwd:
        raise HTTPException(status_code=400, detail="Missing credentials")

    host = await db.host_details.find_one({"email": email, "password": hashpassword(pwd)})
    if not host:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    identity = {"id": str(host["_id"]), "role": "host"}
    access = create_access_token(identity)
    refresh = create_refresh_token(identity)

    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", path="/")
    payload = jwt.decode(access, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    csrf = payload.get("csrf")
    if csrf:
        response.set_cookie("csrf_access", csrf, httponly=False, secure=True, samesite="none", path="/")

    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", path="/auth/refresh")

    host.pop("password", None)
    response.status_code = 200
    response.headers["X-CSRF-Token"] = csrf or ""
    response.headers["Time-Left"] = str(get_time_left_from_payload(payload))
    host["_id"] = str(host["_id"])
    return {"status": "success", "message": "Logged in", "role": "host", "details": host, "isAuthenticated": True}

@app.post("/auth/logout")
async def logout(response: Response):
    # clear cookies
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/auth/refresh")
    response.delete_cookie("csrf_access", path="/")
    return {"status": "success", "message": "Logged out", "isAuthenticated": False}

@app.post("/auth/refresh")
async def refresh(response: Response, request: Request):
    # Read refresh token cookie
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    payload = decode_token(refresh_token)

    # Must be a refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    user_id = payload.get("sub")      # this is a string
    role = payload.get("role")        # stored separately

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Invalid refresh payload")

    # Rebuild identity dict for access token
    identity = {"id": user_id, "role": role}

    # Create new access token
    new_access = create_access_token(identity)

    # Store new access token in cookie
    response.set_cookie(
        "access_token",
        new_access,
        httponly=True,
        secure=True,
        samesite="none",
        path="/"
    )

    # Extract payload to send CSRF token back
    new_payload = jwt.decode(new_access, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    csrf = new_payload.get("csrf")

    # Public CSRF cookie for frontend
    if csrf:
        response.set_cookie(
            "csrf_access",
            csrf,
            httponly=False,
            secure=True,
            samesite="none",
            path="/"
        )

    # Send CSRF in header (optional)
    response.headers["X-CSRF-Token"] = csrf or ""
    response.headers["Time-Left"] = str(get_time_left_from_payload(new_payload))

    return {"status": "success", "message": "Token refreshed"}

@app.get("/auth/me")
async def me(request: Request, x_csrf_token: Optional[str] = Header(None)):
    payload, identity = await get_current_identity(request, x_csrf_token)
    collection = db.user_details if identity["role"] == "user" else db.host_details
    doc = await collection.find_one({"_id": ObjectId(identity["id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")

    doc["_id"] = str(doc["_id"])
    doc.pop("password", None)
    resp = JSONResponse({"status": "success", "details": doc, "role": identity["role"], "isAuthenticated": True})
    resp.headers["X-CSRF-Token"] = x_csrf_token or ""
    resp.headers["Time-Left"] = str(get_time_left_from_payload(payload))
    return resp

# OTP endpoints
@app.get("/auth/generate_otp")
async def generate_otp_route(request: Request, x_csrf_token: Optional[str] = Header(None)):
    payload, identity = await get_current_identity(request, x_csrf_token)
    collection = db.user_details if identity["role"] == "user" else db.host_details
    user = await collection.find_one({"_id": ObjectId(identity["id"])}, {"email": 1, "username": 1})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    expiry = datetime.now() + timedelta(minutes=5)
    await collection.update_one({"_id": ObjectId(identity["id"])}, {"$set": {"otp": otp, "otp_expiry": expiry}})

    res = await send_otp_email(user["email"], otp, user.get("username", "User"))
    if res.get("status") == "success":
        resp = JSONResponse({"status": "success", "message": "OTP generated and email sent"})
        resp.headers["Time-Left"] = str(get_time_left_from_payload(payload))
        return resp
    else:
        raise HTTPException(status_code=500, detail=res.get("message"))

@app.post("/auth/verify_otp")
async def verify_otp_route(request: Request, x_csrf_token: Optional[str] = Header(None)):
    payload, identity = await get_current_identity(request, x_csrf_token)
    data = await request.json()
    otp = (data or {}).get("otp")
    if not otp:
        raise HTTPException(status_code=400, detail="Missing otp")

    collection = db.user_details if identity["role"] == "user" else db.host_details
    user = await collection.find_one({"_id": ObjectId(identity["id"])})
    if not user or "otp" not in user or "otp_expiry" not in user:
        raise HTTPException(status_code=404, detail="OTP not found. Please generate a new one.")

    if datetime.now() > user["otp_expiry"]:
        raise HTTPException(status_code=400, detail="OTP has expired. Please generate a new one.")

    if user["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    await collection.update_one({"_id": ObjectId(identity["id"])}, {"$set": {"Verified": True}, "$unset": {"otp": "", "otp_expiry": ""}})
    resp = JSONResponse({"status": "success", "message": "OTP verified successfully."})
    resp.headers["Time-Left"] = str(get_time_left_from_payload(payload))
    return resp

# Health + root
@app.get("/health")
async def health():
    return {"status": "success", "message": "API healthy"}

@app.get("/")
async def home():
    return {"status": "success", "message": "Welcome to Tournament Organizer API"}
