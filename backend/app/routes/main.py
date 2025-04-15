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