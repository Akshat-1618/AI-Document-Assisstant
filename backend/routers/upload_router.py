from fastapi import APIRouter, UploadFile, File, Request
import os
import shutil

from services.pdf_service import extract_text
from services.chunk_service import chunk_text
from services.gemini_service import generate_embedding
from vector_store.faiss_store import store


router = APIRouter()

UPLOAD_DIR = "data/uploads"


@router.post("/upload")
async def upload_pdf(
    request: Request,
    file: UploadFile = File(...)
):

    try:

        # Ensure upload folder exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        file_path = f"{UPLOAD_DIR}/{file.filename}"


        # ================= SAVE PDF =================

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)


        # ================= EXTRACT TEXT =================

        text = extract_text(file_path)


        # ================= CHUNK TEXT =================

        chunks = chunk_text(text)


        embeddings = []


        # ================= GENERATE EMBEDDINGS =================

        for chunk in chunks:

            emb = generate_embedding(chunk)

            embeddings.append(emb)


        # ================= STORE IN FAISS =================

        store.create_index(embeddings, chunks)


        # ================= MARK DOCUMENT AS UPLOADED =================

        request.app.state.document_uploaded = True


        return {

            "message": "PDF uploaded and indexed successfully",

            "chunks_created": len(chunks),

            "uploaded": True

        }


    except Exception as e:

        # Reset upload status if something fails

        request.app.state.document_uploaded = False

        return {

            "error": str(e),

            "uploaded": False

        }