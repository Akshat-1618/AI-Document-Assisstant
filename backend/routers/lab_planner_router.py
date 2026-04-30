# routers/lab_planner_router.py

from fastapi import APIRouter, UploadFile, File

from datetime import datetime, timedelta

from services.pdf_service import extract_text_from_pdf
from services.gemini_service import generate_answer

from utils.calendar_utils import load_calendar
from utils.lab_timeline import LAB_TIMELINE

router = APIRouter()


# -----------------------------------
# Generate weeks from timeline
# -----------------------------------

def generate_weeks(calendar):

    semester_start = datetime.strptime(
        calendar["semester"]["start_date"],
        "%Y-%m-%d"
    )

    current = semester_start

    rows = []

    week_no = 1

    # -----------------------------------
    # Calendar dates
    # -----------------------------------

    t1_start = datetime.strptime(
        calendar["exams"]["t1"]["start"],
        "%Y-%m-%d"
    )

    t1_end = datetime.strptime(
        calendar["exams"]["t1"]["end"],
        "%Y-%m-%d"
    )

    t2_start = datetime.strptime(
        calendar["exams"]["t2"]["start"],
        "%Y-%m-%d"
    )

    t2_end = datetime.strptime(
        calendar["exams"]["t2"]["end"],
        "%Y-%m-%d"
    )

    break_start = datetime.strptime(
        calendar["breaks"][0]["start"],
        "%Y-%m-%d"
    )

    break_end = datetime.strptime(
        calendar["breaks"][0]["end"],
        "%Y-%m-%d"
    )

    # -----------------------------------
    # Build rows
    # -----------------------------------

    for item in LAB_TIMELINE:

        # -----------------------------------
        # PRACTICE
        # -----------------------------------

        if item == "PRACTICE":

            # Adjust before T1

            if current < t1_start and \
               current + timedelta(days=6) >= t1_start:

                week_end = t1_start - timedelta(days=1)

            # Adjust before BREAK

            elif current < break_start and \
                 current + timedelta(days=6) >= break_start:

                week_end = break_start - timedelta(days=1)

            # Adjust before T2

            elif current < t2_start and \
                 current + timedelta(days=6) >= t2_start:

                week_end = t2_start - timedelta(days=1)

            else:

                week_end = current + timedelta(days=6)

            rows.append({

                "week": f"Week {week_no}",

                "start": current,

                "end": week_end,

                "type": "PRACTICE"

            })

            current = week_end + timedelta(days=1)

            week_no += 1

        # -----------------------------------
        # EVALUATION 1
        # -----------------------------------

        elif item == "EVAL1":

            week_end = current + timedelta(days=6)

            rows.append({

                "week": f"Week {week_no}",

                "start": current,

                "end": week_end,

                "type": "EVAL1"

            })

            current = week_end + timedelta(days=1)

            week_no += 1

        # -----------------------------------
        # LAB TEST 1
        # -----------------------------------

        elif item == "LABTEST1":

            week_end = current + timedelta(days=6)

            rows.append({

                "week": f"Week {week_no}",

                "start": current,

                "end": week_end,

                "type": "LABTEST1"

            })

            current = week_end + timedelta(days=1)

            week_no += 1

        # -----------------------------------
        # T1
        # -----------------------------------

        elif item == "T1":

            rows.append({

                "week": f"Week {week_no}",

                "start": t1_start,

                "end": t1_end,

                "type": "T1"

            })

            current = t1_end + timedelta(days=1)

            week_no += 1

        # -----------------------------------
        # BREAK
        # -----------------------------------

        elif item == "BREAK":

            rows.append({

                "week": f"Week {week_no} & {week_no + 1}",

                "start": break_start,

                "end": break_end,

                "type": "BREAK"

            })

            current = break_end + timedelta(days=1)

            week_no += 2

        # -----------------------------------
        # T2
        # -----------------------------------

        elif item == "T2":

            rows.append({

                "week": f"Week {week_no}",

                "start": t2_start,

                "end": t2_end,

                "type": "T2"

            })

            current = t2_end + timedelta(days=1)

            week_no += 1

        # -----------------------------------
        # EVALUATION 2
        # -----------------------------------

        elif item == "EVAL2":

            week_end = current + timedelta(days=6)

            rows.append({

                "week": f"Week {week_no}",

                "start": current,

                "end": week_end,

                "type": "EVAL2"

            })

            current = week_end + timedelta(days=1)

            week_no += 1

        # -----------------------------------
        # LAB TEST 2
        # -----------------------------------

        elif item == "LABTEST2":

            week_end = current + timedelta(days=6)

            rows.append({

                "week": f"Week {week_no}",

                "start": current,

                "end": week_end,

                "type": "LABTEST2"

            })

            current = week_end + timedelta(days=1)

            week_no += 1

        # -----------------------------------
        # PROJECT
        # -----------------------------------

        elif item == "PROJECT":

            week_end = current + timedelta(days=6)

            rows.append({

                "week": f"Week {week_no}",

                "start": current,

                "end": week_end,

                "type": "PROJECT"

            })

            break

    return rows


# -----------------------------------
# Extract useful lab topics
# -----------------------------------

def extract_lab_topics(text):

    prompt = f"""
You are given a lab syllabus.

Extract ONLY actual lab experiment topics.

RULES:
- Ignore headings
- Ignore faculty names
- Ignore credits
- Ignore course outcomes
- Ignore evaluation criteria
- Ignore semester details
- Return concise lab topics only

Return:
- One topic per line
- No numbering
- No explanations

Example:

Socket Programming
Wireshark
NS2 Simulation
IoT Programs
Black Box Testing

SYLLABUS:

{text}
"""

    try:

        topics = generate_answer(text, prompt)

        clean_topics = []

        for t in topics.split("\n"):

            t = t.strip()

            if len(t) < 3:
                continue

            clean_topics.append(t)

        return clean_topics

    except Exception:

        return [

            "Lab Experiment 1",
            "Lab Experiment 2",
            "Lab Experiment 3"

        ]


# -----------------------------------
# Main Endpoint
# -----------------------------------

@router.post("/lab-planner-agent")

async def generate_lab_plan(

    syllabus: UploadFile = File(...)

):

    # -----------------------------------
    # Load calendar
    # -----------------------------------

    calendar = load_calendar()

    # -----------------------------------
    # Extract PDF text
    # -----------------------------------

    text = extract_text_from_pdf(syllabus)

    # -----------------------------------
    # Extract topics
    # -----------------------------------

    experiments = extract_lab_topics(text)

    # -----------------------------------
    # Generate academic rows
    # -----------------------------------

    weeks = generate_weeks(calendar)

    structured_plan = []

    topic_index = 0

    # -----------------------------------
    # Build planner
    # -----------------------------------

    for row in weeks:

        start = row["start"]

        end = row["end"]

        week_name = row["week"]

        row_type = row["type"]

        topic = ""

        task = ""

        comment = ""

        # -----------------------------------
        # PRACTICE
        # -----------------------------------

        if row_type == "PRACTICE":

            if topic_index < len(experiments):

                topic = experiments[topic_index]

                topic_index += 1

            else:

                topic = "Lab Practice"

            task = "Practice Lab"

        # -----------------------------------
        # EVAL 1
        # -----------------------------------

        elif row_type == "EVAL1":

            topic = (
                "Evaluation based on "
                "previous lab experiments"
            )

            task = "Evaluation-1"

        # -----------------------------------
        # LAB TEST 1
        # -----------------------------------

        elif row_type == "LABTEST1":

            topic = (
                "Lab Test on completed "
                "experiments"
            )

            task = "Lab Test-1"

        # -----------------------------------
        # T1
        # -----------------------------------

        elif row_type == "T1":

            topic = "T-1 Exam"

            task = ""

            comment = "T-1 Exam"

        # -----------------------------------
        # BREAK
        # -----------------------------------

        elif row_type == "BREAK":

            topic = "Semester Break"

            task = ""

            comment = "Mid Semester Break"

        # -----------------------------------
        # T2
        # -----------------------------------

        elif row_type == "T2":

            topic = "T-2 Exam"

            task = ""

            comment = "T-2 Exam"

        # -----------------------------------
        # EVAL 2
        # -----------------------------------

        elif row_type == "EVAL2":

            topic = (
                "Evaluation based on "
                "advanced experiments"
            )

            task = "Evaluation-2"

        # -----------------------------------
        # LAB TEST 2
        # -----------------------------------

        elif row_type == "LABTEST2":

            topic = (
                "Lab Test on advanced "
                "experiments"
            )

            task = "Lab Test-2"

        # -----------------------------------
        # PROJECT
        # -----------------------------------

        elif row_type == "PROJECT":

            topic = "PBL Project"

            task = "Project Evaluation"

        # -----------------------------------
        # Holiday details
        # -----------------------------------

        holiday_texts = []

        for h in calendar["holidays"]:

            holiday_date = datetime.strptime(
                h,
                "%Y-%m-%d"
            )

            if start <= holiday_date <= end:

                formatted = holiday_date.strftime(
                    "%d %b (%a)"
                )

                holiday_texts.append(formatted)

        if holiday_texts:

            holiday_comment = (
                "Holiday: "
                + ", ".join(holiday_texts)
            )

            if comment:

                comment += " | " + holiday_comment

            else:

                comment = holiday_comment

        # -----------------------------------
        # Append row
        # -----------------------------------

        structured_plan.append({

            "week": week_name,

            "date_range":
            f"{start.strftime('%d %b')} - "
            f"{end.strftime('%d %b')}",

            "topic": topic,

            "task": task,

            "comment": comment

        })

    return {

        "lab_plan": structured_plan

    }