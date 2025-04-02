from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime
from app import db

# Users Table
class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.String(36), primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    disease = db.Column(db.String(255), nullable=False)
    dietary_preferences = db.Column(db.String(255), nullable=True)
    allergies = db.Column(db.String(255), nullable=True)
    nutritional_goals = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Recipes Table
class Recipe(db.Model):
    __tablename__ = 'recipes'
    
    recipe_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    preparation_time = db.Column(db.Integer, nullable=False)
    cooking_time = db.Column(db.Integer, nullable=False)
    difficulty_level = db.Column(db.String(50), nullable=False)
    calories = db.Column(db.Float, nullable=False)
    protein = db.Column(db.Float, nullable=False)
    carbs = db.Column(db.Float, nullable=False)
    fat = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Ingredients Table
class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    ingredient_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255), nullable=True)

# Recipe_Ingredients Table (Many-to-Many)
class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'
    
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredient_id'), primary_key=True)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), nullable=False)

# Meal_Plans Table
class MealPlan(db.Model):
    __tablename__ = 'meal_plans'
    
    meal_plan_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Meal_Plan_Recipes Table (Many-to-Many)
class MealPlanRecipe(db.Model):
    __tablename__ = 'meal_plan_recipes'
    
    meal_plan_id = db.Column(db.Integer, db.ForeignKey('meal_plans.meal_plan_id'), primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.recipe_id'), primary_key=True)
    meal_type = db.Column(db.String(50), nullable=False)  # Breakfast, Lunch, Dinner
    date = db.Column(db.Date, nullable=False)

# Shopping_Lists Table
class ShoppingList(db.Model):
    __tablename__ = 'shopping_lists'
    
    shopping_list_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Shopping_List_Items Table (Many-to-Many)
class ShoppingListItem(db.Model):
    __tablename__ = 'shopping_list_items'
    
    shopping_list_id = db.Column(db.Integer, db.ForeignKey('shopping_lists.shopping_list_id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredient_id'), primary_key=True)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50), nullable=False)
    checked = db.Column(db.Boolean, default=False)
