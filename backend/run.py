from app import app, db, socketio  # Import both Flask app and db

# Initialize the database within Flask app context
with app.app_context():
    db.create_all()  # Ensure all tables are created
    print("✅ Database tables created!")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8888, debug=True)
