import edge_tts


VOICE_MAP = {

    "Alex": "en-US-GuyNeural",
    "Sam": "en-US-JennyNeural"

}


async def generate_voice(text, speaker):

    voice = VOICE_MAP.get(
        speaker,
        "en-US-GuyNeural"
    )

    filename = f"temp_{hash(text)}.mp3"

    communicate = edge_tts.Communicate(
        text,
        voice
    )

    await communicate.save(filename)

    return filename