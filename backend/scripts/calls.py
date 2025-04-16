from scripts.setup_utils import *
from typing import List
from logging import getLogger
from pathlib import Path

from llms.language_models import ModelRegistry
from scripts.utils import *

logger = getLogger(__name__)

gpt3_5turbo = ModelRegistry.get("gpt3.5turbo")
gpt4omini = ModelRegistry.get("gpt4omini")
gpt4otranscribe = ModelRegistry.get("gpt4otranscribe")
gpttts = ModelRegistry.get("gpttts")
gpt4o = ModelRegistry.get("gpt4o")
gpt4ominiaudio = ModelRegistry.get("gpt4ominiaudio")


def llm_generate(
    model,
    text: str, 
    history: List[dict] = [], 
    instructions: str = "", 
    image: str = "",
    other: str = "",
    prefix: str = "",
    using_base64: bool = False,
):
    # Build the prompt
    prompt = build_prompt(
        text=text, 
        history=history, 
        instructions=instructions, 
        image=image, 
        other=other, 
        prefix=prefix,
        using_base64=using_base64
    )

    try:
        return model.stream_generate(prompt)
    except Exception as e:
        logger.error(f"Streaming failed: {e}")
        
        def fallback():
            yield "Sorry, something went wrong while generating your recipe.".encode("utf-8")
            
        return fallback()
    
    
def gpt4ominiaudio_generate(
    text: str = "", 
    history: List[dict] = [], 
    instructions: str = "", 
    audio: str = "",
    audio_format: str = "wav",
    voice: str = "nova",
    other: str = "",
    using_base64: str = False,
):
    prompt = build_prompt(
        text=text, 
        history=history, 
        instructions=instructions, 
        audio=audio, 
        audio_format=audio_format,
        other=other, 
        using_base64=using_base64,
    )
    
    stream = gpt4ominiaudio.stream_generate(
        prompt=prompt,
    )
    
    return stream


def gpt4o_speech_to_text(audio: str, using_base64: bool = False):
    if using_base64:
        path = save_tempfile(data=audio, suffix=".wav")
    else:
        path = audio

    audio_file = open(path, "rb")
    transcription = gpt4otranscribe.transcribe(audio_file)
    
    return transcription


def gpt_tts(
    voice: str,
    text: str,
    instructions: str = "",
    file_path: str = "",
):
    return gpttts.generate(
        voice=voice,
        text=text,
        instructions=instructions,
        file_path=file_path,
    )

