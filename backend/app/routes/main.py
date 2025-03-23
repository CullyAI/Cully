from app import app, db  # Import the initialized Flask app and SQLAlchemy instance
from flask import request, jsonify
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
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
@cross_origin(
    origins="http://localhost:8081",
    allow_headers=["Content-Type"],
    supports_credentials=True
)
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        
        if not all([username, email, password]):
            return jsonify({"error": "Missing required fields"}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already exists"}), 400
        
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()
        
        return jsonify({"message": "User created successfully!"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
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