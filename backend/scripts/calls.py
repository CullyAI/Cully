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


# gate_instructions = (
#     "You are a binary classifier. "
#     "You will receive a [user_request] and an [assistant_response]"
#     "If the [assistant_response] fulfills the [user_request], output 'sufficient'. "
#     "Otherwise, output 'needs_follow_up'. "
#     "Output ONLY 'needs_follow_up' or 'sufficient'.\n"
# )

# gate_prompt = (
#     "[user_request]: I would like for you to tell me a joke.\n"
#     "[assistant_response]: Sure, I am processing your request. Give me one moment."
# )

# stream = llm_generate(
#     model=gpt3_5turbo,
#     text=gate_prompt,
#     instructions=gate_instructions,
# )

# for chunk in stream:
#     print(chunk.decode("utf-8"))

# import sys; sys.exit()

# import time
# instructions = "The user has submitted a voice input and their surroundings. " \
#                 + "Your job is to briefly acknowledge the user's voice input " \
#                 + "and let them know their surroundings (an image input) are being processed. " \
#                 + "Do not ask any follow-up questions or prompt the user for more input."

    
# AUDIO_PATH   = Path("scripts/long_voice.wav")
# audio_bytes  = AUDIO_PATH.read_bytes()
# audio_b64    = base64.b64encode(audio_bytes).decode()
    
# stream = gpt4ominiaudio_generate(
#     text="",
#     instructions=instructions,
#     audio=audio_b64,
#     audio_format="wav",
#     using_base64=True,
# )
    
# ----- extract the reply -----
# response = ""
# chunk_time = time.time()
# for chunk in stream:
#     print(f"Chunk in {time.time() - chunk_time} seconds.")
#     text = chunk["data"]
#     response += text
            
# print("GPT-4o-mini-audio response:")
# print(response)

# stream = llm_generate(
#     text="Tell me a joke",
#     prefix=response,
#     instructions="If the answer is already complete, just output nothing."
# )

# mini_response = ""
# for chunk in stream:
#     mini_response += chunk.decode("utf-8")

# print("GPT-4o-mini response:")
# print(mini_response)

