from fastapi import APIRouter, UploadFile, File
import os
import time

from services.pdf_service import extract_text
from services.chunk_service import chunk_text
from services.gemini_service import generate_embedding
from vector_store.faiss_store import store

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Step 1: Extract text
    text = extract_text(file_path)

    # Step 2: Chunk text
    chunks = chunk_text(text)

    # Step 3: Generate embeddings
    embeddings = []

    for chunk in chunks:
        emb = generate_embedding(chunk)
        embeddings.append(emb)
        time.sleep(1)

    # Step 4: Store in FAISS
    store.create_index(embeddings, chunks)

    return {
        "message": "PDF processed and indexed successfully",
        "chunks": len(chunks)
    }