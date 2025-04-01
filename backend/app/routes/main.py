from app import app, db
from flask import request, jsonify, Response, stream_with_context, session
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash

from app.routes.setup_utils import *

from app.models import User
from scripts.gen import gpt4omini_generate

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
    username = data["username"]
    email = data["email"]
    password = generate_password_hash(data["password"])

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400
    
    elif User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(username=username, email=email, password_hash=password)
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
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    
    
@app.route("/recipe", methods=["POST"])
def recipe():
    data = request.get_json()
    user_id = session.get("user_id")
    # if not user_id:
    #     return jsonify({"error": "Not logged in"}), 401

    # user = User.query.get(user_id)
        
    history = data["history"]
    prompt = data["input"]
    instructions = "You are a friendly, helpful recipe generator that only generates recipes."
    # user_info = (
    #     f"The user is allergic to {user.allergies}. "
    #     f"They prefer {user.dietary_preferences} meals and are trying to achieve "
    #     f"{user.nutritional_goals}."
    # )
    
    return Response(
        stream_with_context(
            gpt4omini_generate(
                prompt=prompt, 
                history=history, 
                instructions=instructions, 
                # other=user_info
            )
        ),
        mimetype="text/plain"
    )