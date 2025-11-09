from flask import Flask, request, jsonify, redirect, g
from flask_cors import CORS
from pymongo import MongoClient
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from itsdangerous import URLSafeTimedSerializer
import hashlib, uuid, smtplib, os, datetime
from email.mime.text import MIMEText

SECRET_KEY = "MYSECRETKEY123"
serializer = URLSafeTimedSerializer(SECRET_KEY)
EXPECTED_API_KEY = os.getenv("EXPECTED_API_KEY")

def hashpassword(pwd:str):
    return hashlib.sha256(pwd.encode()).hexdigest()

app = Flask(__name__)
app.secret_key = SECRET_KEY

CORS(app,
     supports_credentials=True,
     origins=["https://superlative-cascaron-a3921e.netlify.app"],
     methods=["GET","POST","PUT","DELETE"]
)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["tournament_organizer"]

# --------------------
# Flask-Login Setup
# --------------------
login_manager = LoginManager(app)
login_manager.login_view = "login"  # default if not authenticated


# --------------------
# User Model Wrapper
# --------------------
class User(UserMixin):
    def __init__(self, email, role):
        self.id = email
        self.role = role

@login_manager.user_loader
def load_user(email):
    user = db.user_details.find_one({"email": email}) or db.host_details.find_one({"email": email})
    if not user:
        return None
    role = "user" if db.user_details.find_one({"email": email}) else "host"
    return User(email, role)


# -------------------
# EMAIL VERIFICATION
# -------------------
def send_email(email, user_type):
    token = serializer.dumps(email)
    link = f"https://tournament-organizer-uwt3.onrender.com/verify/{user_type}/{token}"

    msg = MIMEText(f"Click to verify: {link}")
    msg["Subject"] = "Verify Email"
    msg["From"] = "socialmediatrends11@gmail.com"
    msg["To"] = email

    with smtplib.SMTP("smtp.gmail.com",587) as server:
        server.starttls()
        server.login("socialmediatrends11@gmail.com", "uokanfcrtrepcyzu")
        server.send_message(msg)

    return {"status":"success","message":"Verification email sent!"}


# -----------
# MIDDLEWARE
# -----------
@app.before_request
def api_key_check():
    exempt = ["home","health","verify","login","signup","host_login","host_signup","resend_verification"]
    if request.endpoint in exempt or request.method=="OPTIONS":
        return

    api_key = request.headers.get("x-api-key")
    if not api_key:
        return jsonify({"message":"Unauthorized"}),401

    hashed = hashlib.sha256(api_key.encode()).hexdigest()
    if hashed != EXPECTED_API_KEY:
        return jsonify({"message":"Unauthorized"}),401


# -----------------
# AUTH ROUTES
# -----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    required = ["username","email","phone","password"]
    if any(k not in data for k in required):
        return jsonify({"status":"error","message":"Missing fields"}),400

    data["password"] = hashpassword(data["password"])

    if db.user_details.find_one({"email":data["email"]}) or db.host_details.find_one({"email":data["email"]}):
        return jsonify({"status":"error","message":"User already exists"}),409

    db.user_details.insert_one({
        **data,
        "Verified": False
    })

    # send_email(data["email"], "user")
    return jsonify({"status":"success","message":"Registered! Verify email"}),201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    pwd = hashpassword(data.get("password",""))

    user = db.user_details.find_one({"email":email,"password":pwd}) or db.host_details.find_one({"email":email,"password":pwd})
    if not user:
        return jsonify({"status":"error","message":"Invalid credentials"}),401

    role = "user" if db.user_details.find_one({"email":email}) else "host"

    login_user(User(email, role), remember=True)

    return jsonify({"status":"success","message":"Login successful","details":user,"isAuthenticated":True})


@app.route("/auth-verify", methods=["GET"])
@login_required
def auth_verify():
    return jsonify({
        "status":"success",
        "isAuthenticated":True,
        "email":current_user.id,
        "role":current_user.role
    }),200


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"status":"success","message":"Logged out"}),200


# --------------------
# HOST SIGNUP / LOGIN
# --------------------
@app.route("/host_signup", methods=["POST"])
def host_signup():
    data = request.get_json()
    required = ["username","email","phone","password"]
    if any(k not in data for k in required):
        return jsonify({"status":"error","message":"Missing fields"}),400

    data["password"] = hashpassword(data["password"])

    if db.user_details.find_one({"email":data["email"]}) or db.host_details.find_one({"email":data["email"]}):
        return jsonify({"status":"error","message":"User exists"}),409

    db.host_details.insert_one({
        **data,
        "Verified": False,
        "inviteCode": uuid.uuid4().hex[:12]
    })

    # send_email(data["email"], "host")
    return jsonify({"status":"success","message":"Registered as host"}),201


@app.route("/host_login", methods=["POST"])
def host_login():
    return login()


# --------------------
# EMAIL VERIFY ROUTE
# --------------------
@app.route("/verify/<role>/<token>")
def verify(role, token):
    try:
        email = serializer.loads(token, max_age=3600)
        col = db.user_details if role=="user" else db.host_details
        col.update_one({"email":email},{"$set":{"Verified":True}})
        return redirect("https://myapp.com/login?verified=true")
    except:
        return redirect("https://myapp.com/login?expired=true")


@app.route("/resend_verification", methods=["POST"])
def resend_verification():
    data = request.get_json()
    email = data.get("email")
    role = data.get("role")

    col = db.user_details if role=="user" else db.host_details
    if not col.find_one({"email":email}):
        return jsonify({"status":"error","message":"User not found"}),404

    # send_email(email, role)
    return jsonify({"status":"success","message":"Verification email resent"}),200


# --------------------
# PROTECTED SAMPLE
# --------------------
@app.route("/protected-data")
@login_required
def protected():
    return jsonify({"message":"You are logged in","email":current_user.id,"role":current_user.role})


# --------------------
# BASE ROUTES
# --------------------
@app.route("/health")
def health():
    return jsonify({"message":"API running"}),200

@app.route("/")
def home():
    return jsonify({"message":"API running"}),200


if __name__ == "__main__":
    app.run()
