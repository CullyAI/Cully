from app import app, db
from flask import (
    request, 
    jsonify, 
    session,
    make_response
)
from flask_cors import cross_origin
from werkzeug.security import (
    generate_password_hash, 
    check_password_hash
)

from app.routes.setup_utils import *

from app.models import User

# Test the connection using Flask-SQLAlchemy
with app.app_context():
    try:
        db.engine.connect()
        print("✅ Connection to Supabase Successful!")
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")

# Flask Routes
@app.route("/")
def index():
    return "🚀 Flask API connected to Supabase!"


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    user_id = data["user_id"]
    username = data["username"]
    email = data["email"]
    password = generate_password_hash(data["password"])

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    
    elif User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(user_id=user_id, username=username, email=email, password_hash=password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"})
    
    
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password_hash, password):
        session["user_id"] = user.user_id
        response = make_response(jsonify({"message": "Login successful!"}))
        print(dict(response.headers))  # Should include Set-Cookie
        return response
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    

@app.route("/get_profile", methods=["POST"])
def get_profile():
    data = request.get_json()
    user_id = data["id"]
    
    user = User.query.filter_by(user_id=user_id).first()
    
    if user:
        diseases = user.diseases
        allergies = user.allergies
        nutritional_goals = user.nutritional_goals
        dietary_preferencess = user.dietary_preferences
        
        response = make_response(jsonify({
            "diseases": diseases,
            "allergies": allergies,
            "nutritional_goals": nutritional_goals,
            "dietary_preferences": dietary_preferencess,
        }))
        
        return response, 200
    else:
        return jsonify({"error": "Not logged in"}), 401
    

@app.route("/set_profile", methods=["POST"])
def set_profile():
    data = request.get_json()
    
    user_info = data.get("user", {})
    user_id = user_info.get("id")

    if not user_id:
        return jsonify({"error": "Invalid user object"}), 400

    user = User.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify({"error": "Not logged in"}), 401

    update_fields = {
        "diseases": data.get("diseases"),
        "allergies": data.get("allergies"),
        "nutritional_goals": data.get("nutritional_goals"),
        "dietary_preferences": data.get("dietary_preferences"),
        "macros": data.get("macros"),
    }
    
    print(update_fields)

    for attr, value in update_fields.items():
        if value is not None:
            setattr(user, attr, value)

    db.session.commit()
    
    return jsonify({"success": True}), 200

        
    
    