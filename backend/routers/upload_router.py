from fastapi import APIRouter, UploadFile, File
import os
import shutil

from services.pdf_service import extract_text
from services.chunk_service import chunk_text
from services.gemini_service import generate_embedding
from vector_store.faiss_store import store

router = APIRouter()

UPLOAD_DIR = "data/uploads"


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    try:

        os.makedirs(UPLOAD_DIR, exist_ok=True)

        file_path = f"{UPLOAD_DIR}/{file.filename}"

        # Save PDF
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text
        text = extract_text(file_path)

        # Chunk text
        chunks = chunk_text(text)

        embeddings = []

        # Generate embeddings for each chunk
        for chunk in chunks:
            emb = generate_embedding(chunk)
            embeddings.append(emb)

        # Store in FAISS
        store.create_index(embeddings, chunks)

        return {
            "message": "PDF uploaded and indexed successfully",
            "chunks_created": len(chunks)
        }

    except Exception as e:
        return {"error": str(e)}