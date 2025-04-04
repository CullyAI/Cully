from flask_socketio import emit
from app import socketio
from app.models import User
from scripts.gen import gpt4omini_generate

# Sockets
@socketio.on('generate_recipe')
def handle_generate_recipe(data):
    user = data["user"]
    if not user:
        emit('error', {'message': 'Not logged in'})
        return

    user_row = User.query.get(user['id'])
    history = data["history"]
    prompt = data["input"]
    instructions = "You are a friendly, helpful recipe generator that only generates recipes."
    user_info = (
        f"The user is allergic to {user_row.allergies}. "
        f"They prefer {user_row.dietary_preferences} meals and are trying to achieve "
        f"{user_row.nutritional_goals}."
    )

    for chunk in gpt4omini_generate(prompt=prompt, history=history, instructions=instructions, other=user_info):
        if isinstance(chunk, bytes):
            chunk = chunk.decode("utf-8")
        else:
            chunk = str(chunk)

        emit("recipe_chunk", {"chunk": chunk})

    emit('recipe_complete', {'done': True})
