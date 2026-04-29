from fastapi import APIRouter, UploadFile, File
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import generate_answer

router = APIRouter()


@router.post("/lab-planner-agent")

async def generate_lab_plan(

        syllabus: UploadFile = File(...)

):

    text = extract_text_from_pdf(syllabus)

    prompt = """
Create structured lab plan.

Return format:

Week 1 | Experiment | Task | Remark
Week 2 | Experiment | Task | Remark
"""

    plan = generate_answer(text, prompt)

    structured = []

    for line in plan.split("\n"):

        if "|" in line:

            parts = line.split("|")

            structured.append({

                "week": parts[0].strip(),

                "experiment": parts[1].strip(),

                "task": parts[2].strip(),

                "remark": parts[3].strip()

            })

    return {

        "lab_plan": structured

    }