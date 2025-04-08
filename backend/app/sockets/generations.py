from flask_socketio import emit
from collections import defaultdict

from app import socketio
from app.models import User
from scripts.gen import *

user_transcripts = defaultdict(str)

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
        f"Here are the user's allergies: {user_row.allergies}.\n"
        f"Here are the user's dietary preferences: {user_row.dietary_preferences}\n"
        f"Here are the user's nutritional goals: {user_row.nutritional_goals}."
    )

    stream = gpt4omini_generate(
        text=prompt, 
        history=history, 
        instructions=instructions, 
        other=user_info
    )
    
    for chunk in stream:
        if isinstance(chunk, bytes):
            chunk = chunk.decode("utf-8") 
        else:
            chunk = str(chunk)

        emit("recipe_chunk", {"chunk": chunk})
        socketio.sleep(0.0)

    emit('recipe_complete', {'done': True})
    
    
@socketio.on('send_audio_chunk')
def handle_audio_chunk(data):
    user = data["user"]
    if not user:
        emit('error', {'message': 'Not logged in'})
        return
    
    audio_chunk = data["audio_chunk"]
    transcription = gpt4o_text_to_speech(audio_chunk)
    user_transcripts[user['id']] += transcription
    
    
@socketio.on('done_talking')
def handle_done_talking(data):
    user = data["user"]
    if not user:
        emit('error', {'message': 'Not logged in'})
        return

    user_row = User.query.get(user['id'])
    history = data["history"]
    prompt = data["input"]
    instructions = "You are a friendly, helpful recipe generator that only generates recipes."
    user_info = (
        f"Here are the user's allergies: {user_row.allergies}.\n"
        f"Here are the user's dietary preferences: {user_row.dietary_preferences}\n"
        f"Here are the user's nutritional goals: {user_row.nutritional_goals}."
    )

    stream = gpt4omini_generate(
        text=prompt, 
        history=history, 
        instructions=instructions, 
        other=user_info
    )
    
    for chunk in stream:
        if isinstance(chunk, bytes):
            chunk = chunk.decode("utf-8") 
        else:
            chunk = str(chunk)

        emit("recipe_chunk", {"chunk": chunk})
        socketio.sleep(0.0) # 