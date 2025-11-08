from  pymongo import MongoClient
from  flask import Flask, request, jsonify,redirect,g
from flask_cors import CORS
import hashlib
import uuid
import os
import jwt,datetime
from flask_mail import Mail,Message
from itsdangerous import URLSafeTimedSerializer
from functools import wraps

SECRET_KEY = "MYSECRETKEY123"
serializer = URLSafeTimedSerializer(SECRET_KEY)
EXPECTED_API_KEY =os.getenv("EXPECTED_API_KEY")


def hashpassword(pwd:str):
    return hashlib.sha256(pwd.encode()).hexdigest()


app = Flask(__name__)
CORS(app,supports_credentials=True,origins=["http://localhost:5173"]) 
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db= client["tournament_organizer"]


app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'socialmediatrends11@gmail.com'
app.config['MAIL_PASSWORD'] = 'uoka nfcr trep cyzu'  # use App Password, not Gmail password

mail = Mail(app)


# -------------------------------
# Middleware: Token Required Check
# -------------------------------


def send_email(email:str,user_type:str):
    token = serializer.dumps(email)

    # create verification link
    verify_link = f"https://tournament-organizer-uwt3.onrender.com/verify/{user_type}/{token}"

    # send email
    msg = Message("Verify your Email",
                  sender="socialmediatrends11@gmail.com",
                  recipients=[mail])
    msg.body = f"Click here to verify your account: {verify_link}"
    mail.send(msg)

    return jsonify({"status": "success", "message": "Verification email sent!"}),200





def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("token")

        if not token:
            return jsonify({"status":"error","message": "Token missing. Login again"}), 401
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_role = data.get("role")

            # Dynamically choose collection based on token role
            if user_role == "user":
                collection = db.user_details
            elif user_role == "host":
                collection = db.host_details
            else:
                return jsonify({"status":"error","message":"Unknown role"}), 403

            g.current_user = collection.find_one({"email": data["email"]}, {"_id": 0})

            if not g.current_user:
                return jsonify({"status":"error","message":"User not found"}), 404

        except jwt.ExpiredSignatureError:
            return jsonify({"status":"error","message": "Token expired. Login again"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"status":"error","message": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

def login_user(role, data):
    required_keys = ["email", "password"]
    missing = [k for k in required_keys if k not in data]

    if missing:
        return jsonify({"status": "error", "message": f"Missing keys: {missing}"}), 400

    email = data.get("email", "")
    password = hashpassword(data["password"])

    # choose DB collection
    collection = db.host_details if role == "host" else db.user_details

    try:
        user = collection.find_one({"email": email, "password": password}, {"_id": 0,"password": 0})

        if not user:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401

        token = jwt.encode(
            {
                "email": user["email"],
                "role": role,                    # useful for authorization later
                "exp": datetime.datetime.now() + datetime.timedelta(hours=2)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        response = jsonify({"status": "success", "message": "Login Successful", "details": user,"isAuthenticated":True})
        response.set_cookie("token", token, httponly=True, max_age=7200, samesite="None",secure=True)
        return response

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    


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
        collection.insert_one(user_data)

        # send email with correct verification type
        send_email(data["email"], role)

        return jsonify({"status": "success", "message": "Signup Successful"}), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400



















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





@app.route("/signup", methods=["POST", "OPTIONS"])
def signup():
    return register_user("user", request.get_json())

    

@app.route("/login",methods=["POST","OPTIONS"])
def user_login():
    return login_user("user", request.get_json())


@app.route("/host_signup", methods=["POST", "OPTIONS"])
def host_signup():
    return register_user("host", request.get_json())
    

@app.route("/host_login",methods=["POST","OPTIONS"])
def host_login():
    return login_user("host", request.get_json())

    
    

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
    
        send_email(email, role)
        return jsonify({"status": "success", "message": "Verification email resent"}), 200
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    


@app.route("/logout", methods=["POST"])
@token_required
def logout():
    response = jsonify({"status": "success", "message": "Logged out successfully"})
    response.set_cookie("token", "", httponly=True,expires=0, samesite="None",secure=True)
    return response
    





    

@app.route("/health")
def health():
    return jsonify({"message": "API is running"}),200


@app.route("/")
def home():
    return jsonify({"message": "API is running"}),200



    

if __name__ == "__main__":
    app.run()
        

