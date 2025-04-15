# instructions = "The user has passed in a voice and image input of their environment. " \
#                 + "The image is being processed. " \
#                 + "Briefly acknowledge their voice input and let them know their surroundings are being processed."
    
# AUDIO_PATH   = Path("scripts/test.mp3")
# audio_bytes  = AUDIO_PATH.read_bytes()
# audio_b64    = base64.b64encode(audio_bytes).decode()
    
# start = time.time()
# stream = gpt4ominiaudio_generate(
#     text="",
#     instructions=instructions,
#     audio=audio_b64,
#     audio_format="mp3",
#     using_base64=True,
# )
# finish = time.time()

# print(f"Generation took {finish - start} seconds")
    
# # ----- extract the reply -----
# out_path = "scripts/reply.pcm"          # see note on formats below
# with open(out_path, "wb") as f:
#     for chunk in stream:
#         f.write(chunk)




# import base64, openai, pathlib, time

# openai.api_key = "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"

# AUDIO_PATH   = pathlib.Path("test.mp3")           # 16‑kHz, 1‑channel PCM‑16
# audio_bytes  = AUDIO_PATH.read_bytes()
# audio_b64    = base64.b64encode(audio_bytes).decode()

# instructions = "The user has passed in a voice and image input of their environment. " \
#                 + "The image is being processed. " \
#                 + "Briefly acknowledge their voice input and let them know their surroundings are being processed."

# messages = [
#     {"role": "system", "content": [
#         {"type": "text", "text": instructions}]},
#     {"role": "user",   "content": [
#         {"type": "text", "text": ""},
#         {"type": "input_audio",
#          "input_audio": {
#              "data": audio_b64,
#              "format": "mp3"
#          }}]}
# ]

# start = time.time()
# stream = openai.chat.completions.create(
#     model      = "gpt-4o-mini-audio-preview",
#     modalities = ["text", "audio"],          # must include "audio"
#     audio      = {"voice": "nova", "format": "pcm16"},  # request spoken reply
#     messages   = messages,
#     stream     = True,
# )
# finish = time.time()

# print(f"Finished generating in {finish - start} seconds")

# # ----- extract the reply -----
# out_path = "./output.pcm"          # see note on formats below
# with open(out_path, "wb") as f:
#     for chunk in stream:
#         delta = chunk.choices[0].delta          # ChatCompletionMessageChunk

#         # ----- text tokens (optional) -----
#         if getattr(delta, "content", None):
#             print(delta.content, end="", flush=True)

#         # ----- audio tokens -----
#         audio_part = getattr(delta, "audio", None)   # ← dict or None
#         if audio_part and "data" in audio_part:
#             f.write(base64.b64decode(audio_part["data"]))