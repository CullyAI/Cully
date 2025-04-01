from app import app, db  # Import the initialized Flask app and SQLAlchemy instance
from flask import request, jsonify, Response, stream_with_context
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

@app.route("/process-image", methods=["POST"])
def process_image():
    if 'image' not in request.files:
        return {"error": "No image provided"}, 400

    image = request.files['image']
    filename = image.filename
    print(f"📸 Received image: {filename}")

    # Optional: Save or process image
    # image.save(f"uploads/{filename}")

    return {"message": f"Received {filename}"}, 200

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
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    
    
@app.route("/recipe", methods=["POST"])
def recipe():
    data = request.get_json()
    
    history = data["history"]
    input = data["input"]
    instructions = "You are a friendly, helpful recipe generator that only generates recipes."
    
    result = gpt4omini_generate(input, history, instructions)
    return jsonify(result)