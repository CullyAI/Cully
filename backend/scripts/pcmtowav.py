import wave, pathlib

pcm_file = "reply.pcm"
wav_file = "reply.wav"

channels      = 1
sample_width  = 2       # 16‑bit
sample_rate   = 24000   # ← correct rate for GPT‑4o audio

pcm_data = pathlib.Path(pcm_file).read_bytes()

if pcm_data:
    with wave.open(wav_file, "wb") as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(sample_width)
        wav.setframerate(sample_rate)
        wav.writeframes(pcm_data)

    print("Saved", wav_file, "at 24 kHz – it should now play at normal speed.")
else:
    print("No PCM data found – make sure the stream is being written.")

