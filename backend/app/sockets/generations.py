from flask_socketio import emit
from flask import request
from app import socketio
from app.models import User
from scripts.gen import gpt4omini_generate
import time

# Sockets
# @socketio.on('generate_recipe')
# def handle_generate_recipe(data):
#     user = data["user"]
#     if not user:
#         emit('error', {'message': 'Not logged in'})
#         return

#     user_row = User.query.get(user['id'])
#     history = data["history"]
#     prompt = data["input"]
#     instructions = "You are a friendly, helpful recipe generator that only generates recipes."
#     user_info = (
#         f"The user is allergic to {user_row.allergies}. "
#         f"They prefer {user_row.dietary_preferences} meals and are trying to achieve "
#         f"{user_row.nutritional_goals}."
#     )

#     stream = gpt4omini_generate(
#         prompt=prompt, 
#         history=history, 
#         instructions=instructions, 
#         other=user_info
#     )
    
#     for chunk in stream:
#         if isinstance(chunk, bytes):
#             chunk = chunk.decode("utf-8")
#         else:
#             chunk = str(chunk)

#         socketio.sleep(0.01)
#         emit("recipe_chunk", {"chunk": chunk})

#     emit('recipe_complete', {'done': True})
    
@socketio.on("generate_recipe")
def handle_generate_recipe(data):
    socketio.start_background_task(stream_tokens, data, request.sid)


def stream_tokens(data, sid):
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

    stream = gpt4omini_generate(
        prompt=prompt, 
        history=history, 
        instructions=instructions, 
        other=user_info
    )

    for chunk in stream:
        if isinstance(chunk, bytes):
            chunk = chunk.decode("utf-8")

        socketio.emit("recipe_chunk", {"chunk": chunk}, to=sid)
        socketio.sleep(0.01)  # let event loop yield

    socketio.emit("recipe_complete", {"done": True}, to=sid)
