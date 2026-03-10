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
        "Give a concise paragraph summary of this document."
    )

    return {"summary": summary}


# VISUAL SUMMARY (Mind Map)
@router.get("/summary-visual")
def get_visual_summary():

    store.load_index()

    full_text = "\n".join(store.chunks)

    summary = generate_answer(
        full_text,
        """
Summarize this document into minimum required number of key points.

Rules:
- Each point must represent one idea
- Each point must be on a new line
- Avoid abbreviations breaking
- Keep points short

Example format:

1. First idea
2. Second idea
3. Third idea
4. Fourth idea
"""
    )

    return {"summary": summary}