from flask_socketio import emit
from collections import defaultdict

from app import socketio
from app.models import User
from scripts.calls import *
from llms.instructions import *

import base64
import queue
import time
import random


user_transcripts = defaultdict(str)
user_tts_queue = defaultdict(queue.Queue)
pauses = ["!", ".", "?", ":", "\n", "\n\n"]


def background_job(holder: dict, func, *args, **kwargs):
    """Run *func* in a background thread/green‑thread and stash the result."""
    holder["value"] = func(*args, **kwargs)
    

def user_info_prompt(user_row):
    user_info = (
        f"Here are the user's allergies: {user_row.allergies}.\n"
        f"Here are the user's dietary preferences: {user_row.dietary_preferences}\n"
        f"Here are the user's nutritional goals: {user_row.nutritional_goals}."
    )
    
    return user_info


@socketio.on("generate_recipe")
def handle_generate_recipe(data):
    user = data["user"]
    if not user:
        emit("error", {"message": "Not logged in"})
        return

    user_row = User.query.get(user["id"])
    history = data["history"]
    prompt = data["input"]
    user_info = user_info_prompt(user_row)

    stream = llm_generate(
        text=prompt, 
        history=history, 
        instructions=recipe_instructions, 
        other=user_info
    )
    
    for chunk in stream:
        if isinstance(chunk, bytes):
            chunk = chunk.decode("utf-8") 
        else:
            chunk = str(chunk)

        emit("recipe_chunk", {"chunk": chunk})
        socketio.sleep(0.0)

    emit("recipe_complete", {"done": True})
    

@socketio.on("send_complete_audio")
def handle_complete_audio(data):
    print("Received complete audio")
    
    user = data["user"]
    if not user:
        emit("error", {"message": "Not logged in"})
        return

    user_row = User.query.get(user["id"])
    input_audio = data["audio"]
    input_image = data["image"]
    
    result_box = {}

    task = socketio.start_background_task(
        background_job,          # the wrapper
        result_box,              # holder that will receive "value"
        gpt4o_speech_to_text,    # the function
        input_audio,             # *args → positional
        using_base64=True        # **kwargs → keyword
    )
    
    audio_bytes = gpt_tts(
                voice="nova",
                text=random.choice(processing_phrases),
            )

    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
    
    emit("audio_response", {"audio": audio_base64})
    socketio.sleep(0)
            
    task.join()
    transcription = result_box["value"]
                    
    user_info = user_info_prompt(user_row=user_row)
    response = ""
    
    stream = llm_generate(
        model=gpt4omini,
        text=transcription,
        instructions=realtime_instructions,
        image=input_image,
        other=user_info,
        using_base64=True,
    )
    
    for chunk in stream:
        token = chunk.decode("utf-8")
        response += token
        
        if token[-1] in pauses:
            audio_bytes = gpt_tts(
                voice="nova",
                text=response,
            )

            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
            emit("audio_response", {"audio": audio_base64})
            socketio.sleep(0)
            
            response = ""
            
    if response.strip():
        audio_bytes = gpt_tts(
            text=response,
            voice="nova"
        )
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        emit("audio_response", {"audio": audio_base64})