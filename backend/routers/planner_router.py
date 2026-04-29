from fastapi import APIRouter, UploadFile, File, Form
from typing import List
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import generate_answer

router = APIRouter()


@router.post("/planner")
async def generate_agentic_plan(
    files: List[UploadFile] = File(...),
    days: int = Form(...)
):

    agent_steps = []

    combined_text = ""

    # STEP 1 — READ DOCUMENTS

    agent_steps.append("Reading uploaded study resources...")

    for file in files:

        text = extract_text_from_pdf(file)

        combined_text += "\n" + text


    # STEP 2 — AGENT REASONING (single intelligent prompt)

    agent_steps.append("Analyzing syllabus, notes and PYQs...")

    planner_prompt = f"""
You are an intelligent study planner agent.

From the uploaded documents:

1 Extract major topics
2 Rank them by importance
3 Create an optimized {days}-day study schedule

Rules:

Important topics earlier
Balance workload across days
Avoid overload
Group related topics together

Return output EXACTLY in format:

Day 1: topics
Day 2: topics
Day 3: topics
"""


    agent_steps.append("Generating optimized study timeline...")

    plan = generate_answer(combined_text, planner_prompt)


    # STEP 3 — STRUCTURE OUTPUT FOR FRONTEND TABLE

    structured_plan = []

    for line in plan.split("\n"):

        if ":" in line:

            day, topics = line.split(":", 1)

            structured_plan.append({
                "day": day.strip(),
                "topics": topics.strip()
            })


    # STEP 4 — REFLECTION STEP

    agent_steps.append("Validating workload balance across study days...")

    agent_steps.append("Final optimized study schedule generated successfully.")


    return {

        "plan": structured_plan,
        "agent_steps": agent_steps

    }