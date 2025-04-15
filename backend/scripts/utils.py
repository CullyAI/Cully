from scripts.setup_utils import *
from typing import List
import base64
import os
import tempfile
import struct


def encode_base64(data_path):
    with open(data_path, "rb") as data_file:
        return base64.b64encode(data_file.read()).decode("utf-8")
    
    
def save_tempfile(data, suffix):
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(base64.b64decode(data))
        temp_file.flush()
        return temp_file.name
    

def wav_header(
    sample_rate: int = 24_000,
    channels: int = 1,
    bits_per_sample: int = 16,
) -> bytes:
    """
    Return a 44‑byte RIFF/WAVE header with the size fields set to 0xFFFFFFFF
    so it can be sent before we know the total length.
    """
    byte_rate   = sample_rate * channels * bits_per_sample // 8
    block_align = channels     * bits_per_sample // 8
    unknown     = 0xFFFFFFFF # “streaming” marker

    return struct.pack(
        "<4sI4s"        # RIFF chunk
        "4sIHHIIHH"     # fmt  sub‑chunk
        "4sI",          # data sub‑chunk
        b"RIFF", unknown, b"WAVE",
        b"fmt ", 16,        # PCM fmt chunk is always 16 bytes
        1, channels, sample_rate, byte_rate, block_align, bits_per_sample,
        b"data", unknown,
    )


def build_prompt(
    text: str, 
    history: List[dict] = [], 
    instructions: str = "", 
    image: str = "",
    audio: str = "",
    audio_format: str = "wav",
    other: str = "",
    prefix: str = "",
    using_base64: bool = False
):
    
    user_info = f"\nHere is some information about the user:\n{other}" \
        if other else ""
        
    system_prompt = [{
        "role": "system",
        "content": instructions + user_info
    }]
    
    content = []
    
    if image:
        if using_base64:
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image}"
                }       
            })
        
        elif os.path.isfile(image):
            image = encode_base64(image)
            
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
            "text": text,
        })
        
    if audio:
        if using_base64:
            content.append({
                "type": "input_audio",
                "input_audio": {"data": audio, "format": audio_format},
            })
            
        else:
            content.append({
                "type": "input_audio",
                "input_audio": {"data": encode_base64(audio), "format": audio_format},
            })
            
    
    user_prompt = [{
        "role": "user",
        "content": content,
    }]
    
    if prefix:
        assistant_answer = [{"role": "assistant", "content": prefix}]
    else:
        assistant_answer = []
        
    return system_prompt + history + user_prompt + assistant_answer