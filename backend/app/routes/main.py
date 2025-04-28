from app import app, db
from flask import (
    request, 
    jsonify, 
    session,
    make_response
)
from werkzeug.security import (
    generate_password_hash, 
    check_password_hash
)

from app.routes.setup_utils import *

from app.models import *

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


@app.route('/confirm_email')
def confirm_email():
    return "<h2>Email confirmed!</h2><p>You can now return to the Cully app and log in.</p>"


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
        return response
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    

@app.route("/get_profile", methods=["POST"])
def get_profile():
    data = request.get_json()
    user_id = data["id"]
    
    user = User.query.filter_by(user_id=user_id).first()
    
    if user:
        response = make_response(jsonify({
            "diseases": user.diseases,
            "allergies": user.allergies,
            "nutritional_goals": user.nutritional_goals,
            "dietary_preferences": user.dietary_preferences,
            "age": user.age,
            "sex": user.sex,
            "height": user.height,
            "weight": user.weight,
            "activity_level": user.activity_level,
            "target_weight": user.target_weight,
            "other_info": user.other_info,
            "macros": user.macros,
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
        "age": data.get("age"),
        "sex": data.get("sex"),
        "height": data.get("height"),
        "weight": data.get("weight"),
        "activity_level": data.get("activity_level"),
        "target_weight": data.get("target_weight"),
        "other_info": data.get("other_info"),
        "macros": data.get("macros"),
    }

    for attr, value in update_fields.items():
        if value is not None:
            setattr(user, attr, value)

    db.session.commit()
    
    return jsonify({"success": True}), 200


@app.route("/get_recipes", methods=["POST"])
def get_recipes():
    data = request.get_json()
    
    user_info = data.get("user", {})
    
    if user_info:
        user_id = user_info.get("id")
        recipes = Recipe.query.filter_by(user_id=user_id).all()
    
        serialized = []
        for recipe in recipes:
            serialized.append({
                "recipe_id": recipe.recipe_id,
                "title": recipe.title,
                "description": recipe.description,
                "preparation_time": recipe.preparation_time,
                "cooking_time": recipe.cooking_time,
                "difficulty_level": recipe.difficulty_level,
                "calories": recipe.calories,
                "protein": recipe.protein,
                "carbs": recipe.carbs,
                "fat": recipe.fat,
                "steps": recipe.steps,
                "created_at": recipe.created_at.isoformat(),
                "updated_at": recipe.updated_at.isoformat(),
            })

        return jsonify(serialized), 200
    else:
        return jsonify([{"error": "Not logged in"}]), 401


@app.route("/set_recipe", methods=["POST"])
def set_recipe():
    data = request.get_json()
    
    user_info = data.get("user", {})
    user_id = user_info.get("id")

    if not user_id:
        return jsonify({"error": "Invalid user object"}), 400

    try:
        # Check if a recipe with the same title already exists for the user
        existing_recipe = Recipe.query.filter_by(user_id=user_id, title=data.get("title")).first()

        if existing_recipe:
            # Update the existing recipe
            existing_recipe.description = data.get("description", "")
            existing_recipe.steps = data.get("steps", "")
            existing_recipe.preparation_time = data.get("preparation_time")
            existing_recipe.cooking_time = data.get("cooking_time")
            existing_recipe.difficulty_level = data.get("difficulty_level")
            existing_recipe.calories = data.get("calories")
            existing_recipe.protein = data.get("protein")
            existing_recipe.carbs = data.get("carbs", 0)  # optional fallback
            existing_recipe.fat = data.get("fat")
            db.session.commit()

            return jsonify({
                "success": True, 
                "message": "Recipe updated successfully", 
                "recipe_id": existing_recipe.recipe_id
            }), 200
            
        else:
            # Create a new recipe if no existing recipe is found
            recipe = Recipe(
                user_id=user_id,
                title=data.get("title"),
                description=data.get("description", ""),
                steps=data.get("steps", ""),
                preparation_time=data.get("preparation_time"),
                cooking_time=data.get("cooking_time"),
                difficulty_level=data.get("difficulty_level"),
                calories=data.get("calories"),
                protein=data.get("protein"),
                carbs=data.get("carbs", 0),  # optional fallback
                fat=data.get("fat")
            )

            db.session.add(recipe)
            db.session.commit()

            return jsonify({
                "success": True, 
                "message": "Recipe created successfully", 
                "recipe_id": recipe.recipe_id
            }), 200

    except Exception as e:
        print("❌ Error saving recipe:", e)
        return jsonify({"error": "Failed to save recipe"}), 500
    
    
@app.route("/delete_recipe", methods=["POST"])
def delete_recipe():
    data = request.get_json()
    
    user_info = data.get("user", {})
    user_id = user_info.get("id")
    recipe_id = data.get("recipe_id")

    if not user_id:
        return jsonify({"error": "Invalid user object"}), 400

    if not recipe_id:
        return jsonify({"error": "Recipe ID is required"}), 400

    try:
        recipe = Recipe.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()

        if not recipe:
            return jsonify({"error": "Recipe not found"}), 404

        db.session.delete(recipe)
        db.session.commit()

        return jsonify({
            "success": True, 
            "message": "Recipe deleted successfully"
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to delete recipe"}), 500


        
    
    