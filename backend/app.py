from  pymongo import MongoClient
from  flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import uuid
import os
from flask_mail import Mail,Message
from itsdangerous import URLSafeTimedSerializer

SECRET_KEY = "MYSECRETKEY123"
serializer = URLSafeTimedSerializer(SECRET_KEY)
EXPECTED_API_KEY =os.getenv("EXPECTED_API_KEY")


def hashpassword(pwd:str):
    return hashlib.sha256(pwd.encode()).hexdigest()


app = Flask(__name__)
CORS(app) 
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db= client["tournament_organizer"]


app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your_app_password'  # use App Password, not Gmail password

mail = Mail(app)

@app.before_request
def global_auth_check():
    exempt_routes = ['health','home']
    if request.endpoint in exempt_routes:
        return
    if request.method == "OPTIONS":
        return '', 200
    api_key = request.headers.get('x-api-key')
    if api_key:
        api_key = hashlib.sha256(api_key.encode()).hexdigest()
    if not api_key or api_key != EXPECTED_API_KEY:
        return jsonify({'message': 'Unauthorized'}), 401


def send_email(mail:str):
    token = serializer.dumps(mail)

    # create verification link
    verify_link = f"http://127.0.0.1:5000/verify/{token}"

    # send email
    msg = Message("Verify your Email",
                  sender="your_email@gmail.com",
                  recipients=[mail])
    msg.body = f"Click here to verify your account: {verify_link}"
    mail.send(msg)

    return jsonify({"status": "success", "message": "Verification email sent!"}),200



@app.route("/signup",methods=["POST","OPTIONS"])
def signup():
    data = request.get_json()
    """ username,email, phone, password, The following infomation would be received """
    required_keys = ["username","email","phone","password"]
    missing = [k for k in required_keys if k not in data]

    if missing:
        return jsonify({"status":"error", "message": f"Missing keys: {missing}"}),400
    
    data["password"] = hashpassword(data.get("password",""))
    
    query = {
        "$or": [
            {"username": data["username"]},
            {"email": data["email"]},
            {"phone": data["phone"]},
        ]
    }

    if db.user_details.find_one(query):
        return jsonify({"error": "User with one of these details already exists"}), 409
    
    try:
        db.user_details.insert_one({
            
                "username":data.get("username",""),
                "email":data.get("email",""),
                "phone":data.get("phone",""),
                "password": data.get("password",""),
                "verified": False
            
        })

        send_email(data.get("email",""))        

        return jsonify({"status":"success","message":"Signup Successfull"}),201
    
    except Exception as e:
        return jsonify({"status":"Error","message":str(e)}),400
    


    

@app.route("/login",methods=["POST","OPTIONS"])
def login():
    data = request.get_json()
    required_keys = ["email","password"]
    missing = [k for k in required_keys if k not in data]

    if missing:
        return jsonify({"status":"error", "message": f"Missing keys: {missing}"}),400
    email = data.get("email","")
    password =  hashpassword(data["password"])

    try:
        user =  db.user_details.find_one({"email":email,"password":password},{"_id": 0} )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401
    
    if user:
        return jsonify({"status":"success","message":"Login Successful","details":user}),200
    else:
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    

@app.route("/host_signup",methods=["POST","OPTIONS"])
def host_signup():
    data = request.get_json()
    """ username,email, phone, password, The following infomation would be received """
    required_keys = ["username","email","phone","password"]
    missing = [k for k in required_keys if k not in data]

    if missing:
        return jsonify({"status":"error", "message": f"Missing keys: {missing}"}),400
    
    data["password"] = hashpassword(data.get("password",""))
    
    query = {
        "$or": [
            {"username": data["username"]},
            {"email": data["email"]},
            {"phone": data["phone"]},
        ]
    }

    if db.user_details.find_one(query):
        return jsonify({"error": "User with one of these details already exists"}), 409
    
    try:
        db.host_details.insert_one({
            
                "username":data.get("username",""),
                "email":data.get("email",""),
                "phone":data.get("phone",""),
                "password": data.get("password",""),
                "inviteCode": uuid.uuid4().hex[:12],
                "verified": False 
            
        })

        send_email(data.get("email",""))

        return jsonify({"status":"success","message":"Signup Successfull"}),201
    
    except Exception as e:
        return jsonify({"status":"Error","message":str(e)}),400
    

@app.route("/host_login",methods=["POST","OPTIONS"])
def host_login():
    data = request.get_json()
    required_keys = ["email","password"]
    missing = [k for k in required_keys if k not in data]

    if missing:
        return jsonify({"status":"error", "message": f"Missing keys: {missing}"}),400
    email = data.get("email","")
    password =  hashpassword(data["password"])

    try:
        user =  db.host_details.find_one({"email":email,"password":password},{"_id": 0} )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401
    
    if user:
        return jsonify({"status":"success","message":"Login Successful","details":user}),200
    else:
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    

@app.route("/verify/<token>")
def verify(token):
    try:
        # token expires in 1 hour
        email = serializer.loads(token, max_age=3600)

        
        db.users.update_one({"email": email}, {"$set": {"verified": True}})

        return jsonify({"status":"success","message":"Email verified successfully!"}),200
    except:
        return jsonify({"status":"error","message":"The verification link is invalid or has expired."}),400

    

@app.route("/health")
def health():
    return jsonify({"message": "API is running"}),200


@app.route("/")
def home():
    return jsonify({"message": "API is running"}),200



    

if __name__ == "__main__":
    app.run()
        

