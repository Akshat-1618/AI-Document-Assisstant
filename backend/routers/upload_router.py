from fastapi import APIRouter, UploadFile, File
import os
import shutil

from services.pdf_service import extract_text
from services.chunk_service import chunk_text

router = APIRouter()

UPLOAD_DIR = "data/uploads"


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    try:
        # ensure upload folder exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        file_path = f"{UPLOAD_DIR}/{file.filename}"

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text from PDF
        text = extract_text(file_path)

        # Chunk the extracted text
        chunks = chunk_text(text)

        return {
            "message": "PDF processed successfully",
            "chunks_created": len(chunks),
            "sample_chunk": chunks[0] if chunks else ""
        }

    except Exception as e:
        return {"error": str(e)}