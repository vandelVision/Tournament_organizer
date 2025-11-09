from flask import Flask, request, jsonify, redirect, g, session
from flask_cors import CORS
from pymongo import MongoClient
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from itsdangerous import URLSafeTimedSerializer
import hashlib, uuid, smtplib, os, datetime
from email.mime.text import MIMEText
from bson.objectid import ObjectId
SECRET_KEY = "MYSECRETKEY123"
serializer = URLSafeTimedSerializer(SECRET_KEY)
EXPECTED_API_KEY = os.getenv("EXPECTED_API_KEY")


db= MongoClient(os.getenv("MONGO_URI"))["tournament_organizer"]


def hashpassword(pwd:str):
    return hashlib.sha256(pwd.encode()).hexdigest()

app = Flask(__name__)
app.secret_key = SECRET_KEY

app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
    REMEMBER_COOKIE_SAMESITE="None",
    REMEMBER_COOKIE_SECURE=True
)

CORS(app,
     supports_credentials=True,
     origins=["https://superlative-cascaron-a3921e.netlify.app"],
     methods=["GET","POST","PUT","DELETE"]
)


login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, data, role):
        self.id = str(data["_id"])
        self.email = data["email"]
        self.role = role


@login_manager.user_loader
def load_user(user_id):
        role = session.get("role")
        if role == "host":
            data = db.host_details.find_one({"_id": ObjectId(user_id)})
        else:
            data = db.user_details.find_one({"_id": ObjectId(user_id)})

        if data:
            return User(data, role)
        return None

@app.route("/login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]
    hashed_pwd = hashpassword(password)
    user_data = db.user_details.find_one({"email": email, "password": hashed_pwd})
    if user_data:
        user = User(user_data, "user")
        login_user(user)
        session["role"] = "user"
        user_data["_id"] = str(user_data["_id"])
        return jsonify({"status":"success","message": "Logged in successfully","details":user_data,"isAuthenticated":True}), 200

    else:
        return jsonify({"status":"fail","message": "Invalid credentials"}), 401

@app.route("/host_login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]
    hashed_pwd = hashpassword(password)
    user_data = db.host_details.find_one({"email": email, "password": hashed_pwd})
    if user_data:
        user = User(user_data, "host")
        login_user(user)
        session["role"] = "host"
        user_data["_id"] = str(user_data["_id"])
        return jsonify({"status":"success","message": "Logged in successfully","details":user_data,"isAuthenticated":True}), 200

    else:
        return jsonify({"status":"fail","message": "Invalid credentials"}), 401
    

@app.route("/logout", methods=["POST", "OPTIONS"])
@login_required
def logout():
    logout_user()
    session.pop("role", None)
    return jsonify({"status": "success", "message": "Logged out successfully", "isAuthenticated": False}), 200


##################helper functions####################

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


#####Signup routes#####

@app.route("/host_signup", methods=["POST", "OPTIONS"])
def host_signup():
    return register_user("host", request.get_json())

@app.route("/signup", methods=["POST", "OPTIONS"])
def signup():
    return register_user("user", request.get_json())


if __name__ == "__main__":
    app.run()


    



