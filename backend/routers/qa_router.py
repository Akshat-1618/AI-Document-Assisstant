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

    # Step 1: Convert question → embedding
    query_embedding = generate_embedding(question)

    # Step 2: Search FAISS
    results = store.search(query_embedding)

    # Step 3: Combine chunks
    context = "\n".join(results)

    # Step 4: Generate answer
    answer = generate_answer(context, question)

    return {
        "question": question,
        "answer": answer
    }