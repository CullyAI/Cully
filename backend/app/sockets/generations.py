from flask_socketio import emit
from collections import defaultdict

from app import socketio
from app.models import User
from scripts.gen import *

import uuid
import base64

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
    

@socketio.on('send_complete_audio')
def handle_complete_audio(data):
    user = data["user"]
    if not user:
        emit('error', {'message': 'Not logged in'})
        return

    user_row = User.query.get(user['id'])
    audio = data["audio"]
    transcription = gpt4o_speech_to_text(audio, using_base64=True)
    
    print(transcription)
    
    # history = data["history"]
    instructions = "You are a friendly, helpful kitchen assistant." \
                    + " The inputs will be transcriptions of the user's voice." \
                    + " You will also see images that are coming from the user's camera while they speak." \
                    + " Some of the images will be related to the user's voice input, and some will not." \
                    + " It is up to you to determine what is relevant."
    user_info = (
        f"Here are the user's allergies: {user_row.allergies}.\n"
        f"Here are the user's dietary preferences: {user_row.dietary_preferences}\n"
        f"Here are the user's nutritional goals: {user_row.nutritional_goals}."
    )

    stream = gpt4omini_generate(
        text=transcription,
        instructions=instructions,
        other=user_info
    )
    
    response = ""
    
    for chunk in stream:
        if isinstance(chunk, bytes):
            response += chunk.decode("utf-8") 
        else:
            response += str(chunk)
            
    print(response)
            
    file_path = f"/tmp/{uuid.uuid4()}.m4a"
    instructions = "You are a friendly, helpful kitchen assistant."
    gpt4o_text_to_speech(file_path=file_path, voice="nova", text=response, instructions=instructions)
    
    with open(file_path, "rb") as f:
        audio_base64 = base64.b64encode(f.read()).decode("utf-8")

    emit("audio_response", {"audio": audio_base64})
    
    os.remove(file_path)


    
# @socketio.on('send_audio_chunk')
# def handle_audio_chunk(data):
#     user = data["user"]
#     if not user:
#         emit('error', {'message': 'Not logged in'})
#         return
    
#     audio_chunk = data["audio_chunk"]
#     transcription = gpt4o_text_to_speech(audio_chunk)
#     user_transcripts[user['id']] += transcription