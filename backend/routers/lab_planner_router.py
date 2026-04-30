from fastapi import APIRouter, UploadFile, File
from datetime import datetime, timedelta

from services.pdf_service import extract_text_from_pdf
from services.gemini_service import generate_answer

from utils.calendar_utils import (
    load_calendar,
    is_exam_day,
    is_break_day,
    is_holiday
)

router = APIRouter()


# -----------------------------
# Generate semester week ranges
# -----------------------------

def generate_weeks(start, end):

    weeks = []

    current = start

    while current <= end:

        week_end = current + timedelta(days=6)

        weeks.append((current, week_end))

        current = week_end + timedelta(days=1)

    return weeks


# -----------------------------
# Extract lab experiments
# -----------------------------

def extract_lab_topics(text):

    prompt = f"""
Extract lab experiment titles from this syllabus.

Return format:

Experiment 1
Experiment 2
Experiment 3

Syllabus:

{text}
"""

    try:

        topics = generate_answer(text, prompt)

        if topics:

            return [
                t.strip()
                for t in topics.split("\n")
                if t.strip()
            ]

    except Exception as e:

        print("Gemini failed — switching to fallback parser")

    # ---------------------------
    # fallback logic (very important)
    # ---------------------------

    lines = text.split("\n")

    experiments = []

    for line in lines:

        if "experiment" in line.lower() \
        or "assignment" in line.lower() \
        or "lab" in line.lower():

            experiments.append(line.strip())

    return experiments


# -----------------------------
# Main endpoint
# -----------------------------

@router.post("/lab-planner-agent")

async def generate_lab_plan(syllabus: UploadFile = File(...)):

    calendar = load_calendar()

    semester_start = datetime.strptime(
        calendar["semester"]["start_date"],
        "%Y-%m-%d"
    )

    semester_end = datetime.strptime(
        calendar["semester"]["end_date"],
        "%Y-%m-%d"
    )

    # STEP 1: extract syllabus text
    text = extract_text_from_pdf(syllabus)

    # STEP 2: extract experiment list
    experiments = extract_lab_topics(text)

    # STEP 3: generate semester week ranges
    weeks = generate_weeks(semester_start, semester_end)

    structured_plan = []

    experiment_index = 0

    for i, (start, end) in enumerate(weeks):

        start_str = start.strftime("%Y-%m-%d")

        topic = ""
        task = "Practice Lab"
        comment = ""

        # -------------------------
        # Handle exam windows
        # -------------------------

        if is_exam_day(start_str, calendar):

            topic = "T‑Exam Week"
            task = ""
            comment = "Exam Week"

        # -------------------------
        # Handle semester breaks
        # -------------------------

        elif is_break_day(start_str, calendar):

            topic = ""
            task = ""
            comment = "Semester Break"

        # -------------------------
        # Handle holidays
        # -------------------------

        elif is_holiday(start_str, calendar):

            topic = ""
            task = ""
            comment = "Holiday"

        # -------------------------
        # Insert evaluation logic
        # -------------------------

        elif i == 4:

            topic = "Lab Evaluation‑1"
            task = "Evaluation"

        elif i == 6:

            topic = "Lab Test‑1"
            task = "Lab Test"

        elif i == 12:

            topic = "Lab Evaluation‑2"
            task = "Evaluation"

        elif i == 15:

            topic = "Lab Test‑2"
            task = "Lab Test"

        elif i == len(weeks) - 1:

            topic = "Project Evaluation"
            task = "Evaluation"

        # -------------------------
        # Normal teaching weeks
        # -------------------------

        else:

            if experiment_index < len(experiments):

                topic = experiments[experiment_index]

                experiment_index += 1

        structured_plan.append({

            "week": f"Week {i+1}",

            "date_range":
            f"{start.strftime('%d %b')} - {end.strftime('%d %b')}",

            "topic": topic,

            "task": task,

            "comment": comment

        })

    return {

        "lab_plan": structured_plan

    }