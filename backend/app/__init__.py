import os
from flask import Flask
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

# Ensure all variables are set
if not all([USER, PASSWORD, HOST, PORT, DBNAME]):
    raise RuntimeError("🚨 Missing database environment variables! Check your .env file.")

# Construct the SQLAlchemy connection string
DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set database config **before initializing SQLAlchemy**
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database **once**
db = SQLAlchemy(app)  # Directly bind to app

# Import models after initializing db
from app.models import *

# Print confirmation
print("✅ Flask app registered with SQLAlchemy successfully!")
