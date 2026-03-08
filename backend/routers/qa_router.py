from fastapi import APIRouter
from pydantic import BaseModel

from services.gemini_service import generate_embedding, generate_answer
from vector_store.faiss_store import store

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_question(data: QuestionRequest):

    question = data.question

    # Load index
    store.load_index()

    # Query embedding
    query_embedding = generate_embedding(question)

    # Semantic search
    results = store.search(query_embedding)

    context = "\n".join(results[:3])

    answer = generate_answer(context, question)

    return {
        "question": question,
        "answer": answer
    }