from fastapi import APIRouter
from vector_store.faiss_store import store
from services.gemini_service import generate_answer

router = APIRouter()


@router.get("/summary")
def get_summary():

    store.load_index()

    full_text = "\n".join(store.chunks)

    summary = generate_answer(
        full_text,
        "Give a concise summary of this document."
    )

    return {"summary": summary}