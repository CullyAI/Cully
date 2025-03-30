from scripts.setup_utils import *

from llms.language_models import ModelRegistry

gpt4omini = ModelRegistry.get('gpt4omini')
gpt4o = ModelRegistry.get('gpt4o')

def build_prompt(prompt: str, instructions: str = "", context: str = ""):
    user_info = f"\nHere is some information about the user:\n{context}" \
        if context else ""
        
    return [
        {
            "role": "assistant",
            "content": (
                instructions + user_info
            )
        },
        {
            "role": "user",
            "content": prompt
        }
    ]


def gpt4omini_generate(prompt: str, instructions: str, context: str = "", ):
    messages = build_prompt(prompt, instructions, context)
    response = gpt4omini.generate(messages)
    
    
    try:
        return response[0].message.content
    except Exception as e:
        return "Sorry, something went wrong while generating your recipe."
    
# TODO: Implement prompting with image and audio input
# def gpt4o_generate(prompt: str, image: str = "", audio: str = "", context: str = ""):
#     prompt = [
#         {
#             "role": "assistant",
#             "content": f"You are a friendly, helpful cooking assistant"
#                         + "Here is some information about the user:\n"
#                         + context
#         },
#         {
#             "role": "user",
#             "content": prompt
#         }
#     ]
    
#     response = gpt4o.generate(prompt)
#     return response[0].message.content
    