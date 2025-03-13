from app import app, db  # Import both Flask app and db

# Initialize the database within Flask app context
with app.app_context():
    db.create_all()  # Ensure all tables are created
    print("✅ Database tables created!")

if __name__ == "__main__":
    app.run(debug=True)
