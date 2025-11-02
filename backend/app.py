from  pymongo import MongoClient
from  flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import uuid
import os

EXPECTED_API_KEY =os.getenv("EXPECTED_API_KEY")


def hashpassword(pwd:str):
    return hashlib.sha256(pwd.encode()).hexdigest()


app = Flask(__name__)
CORS(app) 
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db= client["tournament_organizer"]

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
                "password": data.get("password","")
            
        })

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
        user =  db.user_details.find_one({"email":email,"password":password})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401
    
    if user:
        return jsonify({"status":"success","message":"Login Successful"}),200
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
                "inviteCode": uuid.uuid4().hex[:12]
            
        })

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
        user =  db.host_details.find_one({"email":email,"password":password})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 401
    
    if user:
        return jsonify({"status":"success","message":"Login Successful"}),200
    else:
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    

@app.route("/health")
def health():
    return jsonify({"message": "API is running"}),200


@app.route("/")
def home():
    return jsonify({"message": "API is running"}),200



    

if __name__ == "__main__":
    app.run()
        

