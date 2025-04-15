# realtime_vad_client.py
# import json
# import websocket
# import threading
# import queue
# import base64

# class OpenAIRealtimeVAD:
#     def __init__(self, api_key, on_vad_start, on_vad_stop):
#         self.api_key = api_key
#         self.url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17"
#         self.headers = [
#             "Authorization: Bearer " + self.api_key,
#             "OpenAI-Beta: realtime=v1"
#         ]
#         self.on_vad_start = on_vad_start
#         self.on_vad_stop = on_vad_stop
#         self.ws = None
#         self.audio_queue = queue.Queue()
#         self.thread = threading.Thread(target=self._run_ws)
#         self.thread.daemon = True
#         self.thread.start()

#     def _run_ws(self):
#         self.ws = websocket.WebSocketApp(
#             self.url,
#             header=self.headers,
#             on_open=self._on_open,
#             on_message=self._on_message,
#         )
        
#         self.ws.run_forever()

#     def _on_open(self, ws):
#         print("Connected to OpenAI realtime WebSocket.")
#         # Send session config to enable VAD only
#         session_update = {
#             "type": "session.update",
#             "session": {
#                 "turn_detection": {
#                     "type": "server_vad",
#                     "threshold": 0.5,
#                     "prefix_padding_ms": 300,
#                     "silence_duration_ms": 500,
#                     "create_response": False,
#                     "interrupt_response": False
#                 }
#             }
#         }
        
#         ws.send(json.dumps(session_update))

#         # Start thread to send audio
#         threading.Thread(target=self._send_audio_loop, daemon=True).start()

#     def _on_message(self, message):
#         data = json.loads(message)
#         if data.get("type") == "input_audio_buffer.speech_started":
#             self.on_vad_start()
#         if data.get("type") == "input_audio_buffer.speech_stopped":
#             self.on_vad_stop()

#     def _send_audio_loop(self):
#         while True:
#             chunk = self.audio_queue.get()
#             if chunk is None:
#                 break
#             message = {
#                 "type": "audio.user",
#                 "audio": {
#                     "data": base64.b64encode(chunk).decode("utf-8"),
#                     "encoding": "pcm_s16le",
#                     "sample_rate": 16000,
#                     "channels": 1,
#                 }
#             }
#             self.ws.send(json.dumps(message))

#     def send_chunk(self, chunk):
#         self.audio_queue.put(chunk)

#     def close(self):
#         self.audio_queue.put(None)
#         if self.ws:
#             self.ws.close()