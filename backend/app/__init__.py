import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Fetch database credentials
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
SECRET_KEY = os.getenv("secret_key")

# Ensure all variables are set
if not all([USER, PASSWORD, HOST, PORT, DBNAME]):
    raise RuntimeError("🚨 Missing database environment variables! Check your .env file.")

# Construct the SQLAlchemy connection string
DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Initialize Flask app
app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config.update(
    SESSION_COOKIE_SAMESITE="None",  # Or "None" if you switch to HTTPS
    SESSION_COOKIE_SECURE=False     # True if you're serving over HTTPS
)
CORS(app, supports_credentials=True)

@app.before_request
def log_request_info():
    print(f"\n🔔 {request.method} {request.path}")
    print("Headers:", dict(request.headers))
    print("Body:", request.get_data())

# Set database config **before initializing SQLAlchemy**
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database **once**
db = SQLAlchemy(app)  # Directly bind to app

# Import models after initializing db
from app.models import *
from app.routes.main import *

# Print confirmation
print("✅ Flask app registered with SQLAlchemy successfully!")
