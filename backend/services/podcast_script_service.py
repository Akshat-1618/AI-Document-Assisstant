import json
import re

from services.gemini_service import generate_answer


def clean_json_response(response):

    # Remove markdown formatting if Gemini adds it
    response = response.replace("```json", "")
    response = response.replace("```", "")

    # Fix common speaker key mistake
    response = re.sub(
        r'{"speaker","',
        '{"speaker":"',
        response
    )

    response = re.sub(
        r'{"speaker","([A-Za-z]+)"',
        r'{"speaker":"\1"',
        response
    )

    return response.strip()


def generate_podcast_script(text):

    prompt = f"""
You are a podcast script generator.

Convert the following document text into a TWO‑speaker podcast conversation.

Speakers:
Alex (host)
Sam (expert)

Rules:

Return ONLY valid JSON
Return ONLY array format:

[
{{"speaker":"Alex","text":"..."}},
{{"speaker":"Sam","text":"..."}}
]

Do NOT include explanation
Do NOT include markdown
Do NOT include extra text
ONLY JSON

Document:

{text}
"""

    response = generate_answer(text, prompt)

    if not response:

        raise Exception("Empty response from Gemini")

    cleaned = clean_json_response(response)

    try:

        return json.loads(cleaned)

    except Exception as e:

        print("Invalid JSON received:")
        print(cleaned)

        # fallback parser (VERY important safety net)

        lines = cleaned.split("\n")

        script = []

        for line in lines:

            if ":" in line:

                parts = line.split(":", 1)

                speaker = parts[0].strip()

                text = parts[1].strip()

                if speaker in ["Alex", "Sam"]:

                    script.append({

                        "speaker": speaker,
                        "text": text

                    })

        if script:

            return script

        raise Exception("Podcast script JSON parsing failed")