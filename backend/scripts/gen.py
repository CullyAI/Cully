from scripts.setup_utils import *
from typing import List
from llms.language_models import ModelRegistry
import base64
from logging import getLogger
import os

logger = getLogger(__name__)

gpt4omini = ModelRegistry.get("gpt4omini")
gpt4otranscribe = ModelRegistry.get("gpt4otranscribe")
gpt4ominitts = ModelRegistry.get("gpt4ominitts")
gpt4o = ModelRegistry.get("gpt4o")


# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    

def build_prompt(
    text: str, 
    history: List[dict] = [], 
    instructions: str = "", 
    image: str = "",
    other: str = ""
):
    
    user_info = f"\nHere is some information about the user:\n{other}" \
        if other else ""
        
    system_prompt = [{
        "role": "system",
        "content": instructions + user_info
    }]
    
    content = []
    
    if image:
        print("We have n image")
        if os.path.isfile(image):
            image = encode_image(image)
            
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image}"
                }
            })

        else:
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": image
                }
            })
        
    if text:
        content.append({
            "type": "text",
            "text": text
        })
    
    user_prompt = [{
        "role": "user",
        "content": content
    }]
        
    return system_prompt + history + user_prompt


def gpt4omini_generate(
    text: str, 
    history: List[dict] = [], 
    instructions: str = "", 
    image: str = "",
    other: str = ""
):
    # Build the prompt
    prompt = build_prompt(text, history, instructions, image, other)

    try:
        return gpt4omini.stream_generate(prompt)
    except Exception as e:
        logger.error(f"Streaming failed: {e}")
        
        def fallback():
            yield "Sorry, something went wrong while generating your recipe.".encode("utf-8")
            
        return fallback()


def gpt4o_generate(
    text: str, 
    history: List[dict] = [], 
    instructions: str = "", 
    image: str = "",
    other: str = ""
):
    # Build the prompt
    prompt = build_prompt(text, history, instructions, image, other)

    try:
        return gpt4o.stream_generate(prompt)
    except Exception as e:
        logger.error(f"Streaming failed: {e}")
        
        def fallback():
            yield "Sorry, something went wrong while generating your recipe.".encode("utf-8")
            
        return fallback()
    

def gpt4o_speech_to_text(audio: str):
    audio_file = open(audio, "rb")
    transcription = gpt4otranscribe.transcribe(audio_file)
    
    return transcription


def gpt4o_text_to_speech(
    file_path: str,
    voice: str,
    text: str,
    instructions: str = None,
):
    gpt4ominitts.generate(
        file_path=file_path,
        text=text,
        instructions=instructions,
        voice=voice
    )