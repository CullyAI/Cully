from flask_socketio import emit
from collections import defaultdict, deque

from app import socketio
from app.models import User
from scripts.calls import *
from llms.instructions import *
from configs.log import logging
from configs.diseases import diseases

import base64
import json
import random
import time
import structlog

log = structlog.get_logger()

user_history = defaultdict(lambda: deque(maxlen=10))
cancel_flags = defaultdict(lambda: False)

with open("preprocess/preprocess_base64.json", 'r', encoding='utf-8') as f:
    preprocesses = json.load(f)


def background_job(holder: dict, func, *args, **kwargs):
    """Run *func* in a background thread/green-thread and stash the result."""
    holder["value"] = func(*args, **kwargs)
    

def user_info_prompt(user_row):
    user_diseases = [d.strip() for d in user_row.diseases.split(",") if d.strip()]
    restrictions = [diseases[d] for d in user_diseases if d in diseases]

    if restrictions:
        disease_restrictions = ", ".join(restrictions[:-1]) + f", and {restrictions[-1]}"
        
    disease_string = (
        f"The user has {user_row.diseases}, and thus requires {disease_restrictions}.\n" \
        if user_row.diseases else ""
    )
    allergies_string = (
        f"Here are the user's allergies: {user_row.allergies}.\n"
        if user_row.allergies else ""
    )
    preferences_string = (
        f"Here are the user's dietary preferences: {user_row.dietary_preferences}\n"
        if user_row.dietary_preferences else ""
    )
    goals_string = (
        f"Here are the user's nutritional goals: {user_row.nutritional_goals}."
        if user_row.nutritional_goals else ""
    )
        
    user_info = (
        disease_string +
        allergies_string +
        preferences_string +
        goals_string
    )
    
    print(user_info)
    
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
        model=gpt4omini,
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
    

@socketio.on("send_multimodal")
def handle_multimodal(data):
    log.info("HandlingMultimodal")
    
    start_time = time.time()
    user = data["user"]
    
    if not user:
        emit("error", {"message": "Not logged in"})
        return
    
    user_id = user["id"]
    cancel_flags[user_id] = False

    user_row = User.query.get(user["id"])
    input_audio = data["audio"]
    input_image = data["image"]
    
    log.info("Audio", detail=input_audio[:20])
    log.info("Image", detail=input_image[:20])
    
    result_box = {}
    task = socketio.start_background_task(
        background_job,          # the wrapper
        result_box,              # holder that will receive "value"
        gpt4o_speech_to_text,    # the function
        input_audio,             # *args → positional
        using_base64=True        # **kwargs → keyword
    )

    preprocess = random.choice(preprocesses)
    
    emit("audio_response", {"audio": preprocess})
    socketio.sleep(0)
    
    sent_preprocess_audio_time = time.time()
    log.info("SentPreprocessAudio", elapsed=round(sent_preprocess_audio_time - start_time, 3))
            
    task.join()
    transcription = result_box["value"]
                    
    user_info = user_info_prompt(user_row=user_row)
    history = list(user_history[user_id])
    cur_chunk = ""
    response = ""
    
    stream = llm_generate(
        model=gpt4omini,
        text=transcription,
        history=history,
        instructions=realtime_instructions,
        image=input_image,
        other=user_info,
        using_base64=True,
    )
    
    chunk_time = time.time()
    start_generation_time = time.time()
    
    for chunk in stream:
        if cancel_flags[user_id]:
            break
        
        token = chunk.decode("utf-8")
        cur_chunk += token
        response += token
        
        if token[-1] in pauses:
            if cancel_flags[user_id]:
                break
            
            log.info("ChunkComplete", elapsed=round(time.time() - chunk_time, 3))
            chunk_time = time.time()
            
            start_tts_time = time.time()
            
            audio_bytes = gpt_tts(
                voice="nova",
                text=cur_chunk,
            )
            
            log.info("TTSComplete", elapsed=round(time.time() - start_tts_time, 3))

            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
            
            if cancel_flags[user_id]:
                break
        
            emit("audio_response", {"audio": audio_base64})
            socketio.sleep(0)
            
            cur_chunk = ""
            
    if cur_chunk.strip() and not cancel_flags[user_id]:
        start_tts_time = time.time()
        
        audio_bytes = gpt_tts(
            text=cur_chunk,
            voice="nova"
        )
        
        log.info("TTSComplete", elapsed=round(time.time() - start_tts_time, 3))
        
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        if not cancel_flags[user_id]:
            emit("audio_response", {"audio": audio_base64})
        
    user_history[user_id].append({"role": "user", "content": transcription})
    user_history[user_id].append({"role": "assistant", "content": response})
        
    log.info("GenerationComplete", elapsed=round(time.time() - start_generation_time, 3))
    log.info("Input", detail=transcription)
    log.info("Response", detail=response)
    

@socketio.on("send_audio")
def handle_audio(data):
    log.info("HandlingAudio")

    user = data["user"]
    
    if not user:
        emit("error", {"message": "Not logged in"})
        return
    
    user_id = user["id"]
    cancel_flags[user_id] = False

    user_row = User.query.get(user["id"])
    input_audio = data["audio"]
                    
    user_info = user_info_prompt(user_row=user_row)
    history = list(user_history[user_id])
    cur_chunk = ""
    response = ""
    
    result_box = {}
    task = socketio.start_background_task(
        background_job,          # the wrapper
        result_box,              # holder that will receive "value"
        gpt4o_speech_to_text,    # the function
        input_audio,             # *args → positional
        using_base64=True        # **kwargs → keyword
    )
    
    stream = gpt4ominiaudio_generate(
        audio=input_audio,
        history=history,
        instructions=audio_only_instructions,
        other=user_info,
        using_base64=True,
    )
    
    chunk_time = time.time()
    start_generation_time = time.time()
    
    for token in stream:
        cur_chunk += token
        response += token
        
        if cancel_flags[user_id]:
            break
        
        if token[-1] in pauses:
            if cancel_flags[user_id]:
                break
            
            log.info("ChunkComplete", elapsed=round(time.time() - chunk_time, 3))
            chunk_time = time.time()
            
            start_tts_time = time.time()
            audio_bytes = gpt_tts(
                voice="nova",
                text=cur_chunk,
            )
            
            log.info("TTSComplete", elapsed=round(time.time() - start_tts_time, 3))

            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
            
            if cancel_flags[user_id]:
                break
            
            emit("audio_response", {"audio": audio_base64})
            socketio.sleep(0)
            
            cur_chunk = ""
            
    if cur_chunk.strip() and not cancel_flags[user_id]:
        start_tts_time = time.time()
        if not cancel_flags:
            audio_bytes = gpt_tts(
                text=cur_chunk,
                voice="nova"
            )
            
            log.info("TTSComplete", elapsed=round(time.time() - start_tts_time, 3))
            
            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
            if not cancel_flags[user_id]:
                emit("audio_response", {"audio": audio_base64})
        
    task.join()
    transcription = result_box["value"]
        
    user_history[user_id].append({"role": "user", "content": transcription})
    user_history[user_id].append({"role": "assistant", "content": response})
        
    log.info("GenerationComplete", elapsed=round(time.time() - start_generation_time, 3))
    log.info("Input", detail=transcription)
    log.info("Response", detail=response)
    

@socketio.on("cancel_generation")
def handle_cancel(data):
    user = data["user"]
    user_id = user.get("id")
    cancel_flags[user_id] = True
    
    log.info("GenerationCancelled", detail=f"user_id: {user_id}")