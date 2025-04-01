from scripts.setup_utils import *
from typing import List
from llms.language_models import ModelRegistry
from logging import getLogger

logger = getLogger(__name__)

gpt4omini = ModelRegistry.get('gpt4omini')
gpt4o = ModelRegistry.get('gpt4o')

def build_prompt(prompt: str, history: List[dict] = [], instructions: str = "", other: str = ""):
    user_info = f"\nHere is some information about the user:\n{other}" \
        if other else ""
        
    system_prompt = [{
        "role": "system",
        "content": instructions + user_info
    }]
    
    user_prompt = [{
        "role": "user",
        "content": prompt
    }]
        
    return system_prompt + history + user_prompt


def gpt4omini_generate(prompt: str, history: List[dict] = [], instructions: str = "", other: str = ""):
    messages = build_prompt(prompt, history, instructions, other)

    try:
        return gpt4omini.stream_generate(messages)
    except Exception as e:
        logger.error(f"Streaming failed: {e}")
        
        def fallback():
            yield "Sorry, something went wrong while generating your recipe.".encode("utf-8")
            
        return fallback()
    
prompt = "Tell me a story"
stream = gpt4omini_generate(prompt)
result = b""
tokens = 0

for chunk in stream:
    tokens += 1
    result += chunk
    
print(result)
print(tokens)
    
# TODO: Implement prompting with image and audio input
# def gpt4o_generate(prompt: str, image: str = "", audio: str = "", other: str = ""):
#     prompt = [
#         {
#             "role": "assistant",
#             "content": f"You are a friendly, helpful cooking assistant"
#                         + "Here is some information about the user:\n"
#                         + other
#         },
#         {
#             "role": "user",
#             "content": prompt
#         }
#     ]
    
#     return response[0].message.content