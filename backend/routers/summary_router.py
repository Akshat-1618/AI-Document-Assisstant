from fastapi import APIRouter
from vector_store.faiss_store import store
from services.gemini_service import generate_answer

router = APIRouter()


@router.get("/summary")
def get_summary():

    if store.index is None:
        store.load_index()

    full_text = "\n".join(store.chunks)

    summary = generate_answer(
        full_text,
        "Provide a short summary of this document."
    )

    return {
        "summary": summary
    }