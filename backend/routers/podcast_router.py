from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import os

from services.pdf_service import extract_text_from_pdf
from services.podcast_script_service import generate_podcast_script
from services.podcast_tts_service import generate_voice
from services.podcast_merge_service import merge_audio


router = APIRouter()


@router.post("/generate-podcast")
async def generate_podcast(file: UploadFile = File(...)):

    # STEP 1 — extract text
    text = extract_text_from_pdf(file)

    # STEP 2 — generate script
    script = generate_podcast_script(text)

    audio_files = []

    try:

        # STEP 3 — generate multi‑speaker voices

        for dialogue in script:

            speaker = dialogue["speaker"]

            audio_path = await generate_voice(
                dialogue["text"],
                speaker
            )

            audio_files.append(audio_path)

    except Exception as e:

        print("Switching to single-speaker fallback mode")

        combined_script = " ".join(
            [d["text"] for d in script]
        )

        fallback_audio = await generate_voice(
            combined_script,
            "Alex"
        )

        audio_files = [fallback_audio]

    # STEP 4 — merge audio clips

    final_audio = merge_audio(audio_files)

    final_filename = "podcast.mp3"

    os.replace(final_audio, final_filename)

    # STEP 5 — return transcript + audio URL

    return JSONResponse({

        "audio_url":
        "http://127.0.0.1:8000/audio/podcast.mp3",

        "script": script

    })