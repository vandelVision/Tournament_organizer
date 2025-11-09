from flask import Flask, request, jsonify, redirect, g, session
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


@app.before_request
def global_auth_check():
    exempt_routes = ['health','home','verify']
    if request.endpoint in exempt_routes:
        return
    if request.method == "OPTIONS":
        return '', 200
    api_key = request.headers.get('x-api-key')
    if api_key:
        api_key = hashlib.sha256(api_key.encode()).hexdigest()
    if not api_key or api_key != EXPECTED_API_KEY:
        return jsonify({'message': 'Unauthorized'}), 401
    

# --------------------

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["tournament_organizer"]

# --------------------
# Flask-Login Setup
# --------------------
login_manager = LoginManager(app)


# --------------------
# User model
# --------------------
class User(UserMixin):
    def __init__(self, email, role):
        self.id = email
        self.role = role


def send_email(email, user_type):
    token = serializer.dumps(email)
    verify_link = f"https://tournament-organizer-uwt3.onrender.com/verify/{user_type}/{token}"

    msg = MIMEText(f"Click here to verify: {verify_link}")
    msg["Subject"] = "Verify Email"
    msg["From"] = "socialmediatrends11@gmail.com"
    msg["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("socialmediatrends11@gmail.com", "uokanfcrtrepcyzu")
        server.send_message(msg)

    return {"status":"success","message":"Verification email sent!"}



def register_user(role, data):
    required_keys = ["username", "email", "phone", "password"]
    missing = [k for k in required_keys if k not in data]

    if missing:
        return jsonify({"status": "error", "message": f"Missing keys: {missing}"}), 400

    data["password"] = hashpassword(data.get("password", ""))

    # Check duplicate across BOTH collections
    query = {
        "$or": [
            {"username": data["username"]},
            {"email": data["email"]},
            {"phone": data["phone"]},
        ]
    }

    # Choose correct collection
    if role == "host":
        collection = db.host_details
    else:
        collection = db.user_details

    if db.user_details.find_one(query) or db.host_details.find_one(query):
        return jsonify({"status":"error","message":"User with one of these details already exists"}), 409

    user_data = {
        "username": data["username"],
        "email": data["email"],
        "phone": data["phone"],
        "password": data["password"],
        "Verified": False
    }

    if role == "host":
        user_data["inviteCode"] = uuid.uuid4().hex[:12]

    try:
        

        # send email with correct verification type
        #res = send_email(data["email"], role)
        collection.insert_one(user_data)
        return jsonify({"status": "success", "message": "verification email resent"}), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


@login_manager.user_loader
def load_user(email):
    role = session.get("role")
    if not role:
        return None

    if role == "user":
        user = db.user_details.find_one({"email": email})
    elif role == "host":
        user = db.host_details.find_one({"email": email})
    else:
        return None

    return User(email, role) if user else None


# --------------
# USER LOGIN
# --------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    pwd = hashpassword(data.get("password", ""))

    user = db.user_details.find_one({"email": email, "password": pwd})
    if not user:
        return jsonify({"status": "error", "message": "Invalid user credentials"}), 401

    session["role"] = "user"
    login_user(User(email, "user"), remember=True)

    return jsonify({"status": "success", "message": "User login successful", "details": user, "isAuthenticated": True})



@app.route("/signup", methods=["POST", "OPTIONS"])
def signup():
    return register_user("user", request.get_json())
    

@app.route("/host_signup", methods=["POST", "OPTIONS"])
def host_signup():
    return register_user("host", request.get_json())

# --------------
# HOST LOGIN
# --------------
@app.route("/host_login", methods=["POST","OPTIONS"])
def host_login():
    data = request.get_json()
    email = data.get("email")
    pwd = hashpassword(data.get("password", ""))

    host = db.host_details.find_one({"email": email, "password": pwd})
    if not host:
        return jsonify({"status": "error", "message": "Invalid host credentials"}), 401

    session["role"] = "host"
    login_user(User(email, "host"), remember=True)

    return jsonify({"status": "success", "message": "Host login successful", "details": host, "isAuthenticated": True})


# ✅ AUTH VERIFY AFTER REFRESH
@app.route("/auth-verify", methods=["GET","OPTIONS"])
@login_required
def auth_verify():
    return jsonify({
        "status": "success",
        "isAuthenticated": True,
        "email": current_user.id,
        "role": current_user.role
    })


# ✅ LOGOUT
@app.route("/logout", methods=["POST","OPTIONS"])
@login_required
def logout():
    session.pop("role", None)
    logout_user()
    return jsonify({"status": "success", "message": "Logged out"}), 200



@app.route("/verify/<role>/<token>")
def verify(role,token):
    try:
        # token expires in 1 hour
        email = serializer.loads(token, max_age=3600)

        # choose correct collection based on role
        if role == "user":
            collection = db.user_details
        elif role == "host":
            collection = db.host_details
        else:
            return jsonify({"status": "error", "message": "Invalid role"}), 400

        # update in correct database
        collection.update_one({"email": email}, {"$set": {"Verified": True}})

        return redirect("https://myapp.com/login?status=Verified")
    except:
        return redirect("https://myapp.com/login?status=expired")
    

@app.route("/resend_verification", methods=["POST"])
def resend_verification():
    data = request.get_json()

    required_keys = ["email", "role"]
    missing = [k for k in required_keys if k not in data]
    if missing:
        return jsonify({"status":"error", "message": f"Missing keys: {missing}"}), 400

    email = data["email"]
    role = data["role"]
    collection = db.user_details if role == "user" else db.host_details

    user= collection.find_one({"email": email}, {"_id": 0})

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    

    try:
    
        #res = send_email(email, role)
        return jsonify({"status": "success", "message": "Verification email resent"}), 200
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    


@app.route("/health")
def health():
    return jsonify({"message": "API is running"}),200


@app.route("/")
def home():
    return jsonify({"message": "API is running"}),200




if __name__ == "__main__":
    app.run()

