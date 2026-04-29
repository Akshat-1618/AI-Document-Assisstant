from pypdf import PdfReader
from fastapi import UploadFile
import io


def extract_text(pdf_path: str) -> str:

    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text

    return text


def extract_text_from_pdf(file: UploadFile) -> str:

    pdf_bytes = file.file.read()

    reader = PdfReader(io.BytesIO(pdf_bytes))

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text

    return text