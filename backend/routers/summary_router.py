from fastapi import APIRouter
from vector_store.faiss_store import store
from services.gemini_service import generate_answer

router = APIRouter()


# TEXT SUMMARY
@router.get("/summary-text")
def get_text_summary():

    store.load_index()

    full_text = "\n".join(store.chunks)

    summary = generate_answer(
        full_text,
        """
Give a concise structured summary of this document.

Rules:
- Use short paragraphs
- Cover main topics
- Keep explanation simple
"""
    )

    return {"summary": summary}


# VISUAL SUMMARY (Structured Mind Map Nodes)
@router.get("/summary-visual")
def get_visual_summary():

    store.load_index()

    full_text = "\n".join(store.chunks)

    summary = generate_answer(
        full_text,
        """
Extract the key ideas from this document.

Return output strictly in this format:

Idea 1
Idea 2
Idea 3
Idea 4
Idea 5

Rules:
- One idea per line
- No numbering
- No abbreviations splitting
- No extra explanation
- Minimum required number of ideas only
"""
    )

    # Convert text → clean list
    points = [
        line.strip()
        for line in summary.split("\n")
        if line.strip()
    ]

    return {"points": points}