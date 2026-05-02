from fastapi import APIRouter, UploadFile, File, Form
from datetime import datetime, timedelta

from services.pdf_service import extract_text_from_pdf
from services.syllabus_parser_service import extract_topics_from_syllabus
from services.gemini_service import generate_answer

from utils.calendar_utils import load_calendar

router = APIRouter()


# -----------------------------------
# Generate weeks
# -----------------------------------

def generate_weeks(calendar):
    semester_start = datetime.strptime(calendar["semester"]["start_date"], "%Y-%m-%d")
    semester_end = datetime.strptime(calendar["semester"]["end_date"], "%Y-%m-%d")

    weeks = []
    current = semester_start
    week_no = 1

    while current <= semester_end:
        week_end = min(current + timedelta(days=6), semester_end)

        weeks.append({
            "week": f"Week {week_no}",
            "start": current,
            "end": week_end
        })

        current = week_end + timedelta(days=1)
        week_no += 1

    return weeks


# -----------------------------------
# Week Type Detection
# -----------------------------------

def get_week_type(start, end, calendar):

    t1_start = datetime.strptime(calendar["exams"]["t1"]["start"], "%Y-%m-%d")
    t1_end = datetime.strptime(calendar["exams"]["t1"]["end"], "%Y-%m-%d")

    t2_start = datetime.strptime(calendar["exams"]["t2"]["start"], "%Y-%m-%d")
    t2_end = datetime.strptime(calendar["exams"]["t2"]["end"], "%Y-%m-%d")

    break_start = datetime.strptime(calendar["breaks"][0]["start"], "%Y-%m-%d")
    break_end = datetime.strptime(calendar["breaks"][0]["end"], "%Y-%m-%d")

    if start <= t1_end and end >= t1_start:
        return "T1 Exam"

    if start <= t2_end and end >= t2_start:
        return "T2 Exam"

    if start <= break_end and end >= break_start:
        return "Holi Break"

    return ""


# -----------------------------------
# Count Classes
# -----------------------------------

def count_classes_in_week(week, lecture_days, calendar):

    start = week["start"]
    end = week["end"]

    if get_week_type(start, end, calendar):
        return 0

    holiday_dates = set(calendar["holidays"])

    count = 0
    current = start

    while current <= end:
        if (
            current.strftime("%A") in lecture_days and
            current.strftime("%Y-%m-%d") not in holiday_dates
        ):
            count += 1

        current += timedelta(days=1)

    return count


# -----------------------------------
# LLM Topic Expansion
# -----------------------------------

def expand_topics_into_lectures(topics, total):

    prompt = f"""
You are an expert university professor.

Convert syllabus topics into a lecture plan.

STRICT RULES:
- EXACTLY {total} lectures
- NO intro text
- NO explanation
- NO numbering
- ONLY lecture titles
- Logical flow
- Continue topic before switching

OUTPUT:
{total} lines only

TOPICS:
{chr(10).join(topics)}
"""

    try:
        res = generate_answer("", prompt)

        lectures = []

        for line in res.split("\n"):
            line = line.strip()

            if not line:
                continue

            if "lecture plan" in line.lower():
                continue

            while len(line) > 0 and (line[0].isdigit() or line[0] in [".", " "]):
                line = line[1:]

            line = line.strip()

            if line:
                lectures.append(line)

        while len(lectures) < total:
            lectures.append("Revision")

        return lectures[:total]

    except:
        return ["Lecture"] * total


# -----------------------------------
# Merge No-Class Weeks
# -----------------------------------

def merge_weeks(data):

    merged = []
    temp = None

    for row in data:

        if row["classes"] == 0:

            if temp is None:
                temp = row.copy()
            else:
                temp["date_range"] = (
                    temp["date_range"].split(" - ")[0]
                    + " - " +
                    row["date_range"].split(" - ")[1]
                )

                if row["topic"] != "No Class":
                    temp["topic"] = row["topic"]

        else:

            if temp:
                merged.append(temp)
                temp = None

            merged.append(row)

    if temp:
        merged.append(temp)

    return merged


# -----------------------------------
# MAIN
# -----------------------------------

@router.post("/lecture-planner-agent")
async def generate_lecture_plan(
    syllabus: UploadFile = File(...),
    lecture_days: str = Form(...)
):

    lecture_days = lecture_days.split(",")

    calendar = load_calendar()

    text = extract_text_from_pdf(syllabus)
    topics = extract_topics_from_syllabus(text)

    weeks = generate_weeks(calendar)

    weekly_classes = []
    total_classes = 0

    for w in weeks:
        c = count_classes_in_week(w, lecture_days, calendar)
        weekly_classes.append(c)
        total_classes += c

    if total_classes == 0:
        return {"lecture_plan": [], "message": "No valid classes"}

    REQUIRED = 42

    # -------------------------------
    # KEY LOGIC
    # -------------------------------

    syllabus_classes = min(total_classes, REQUIRED)

    lecture_plan = expand_topics_into_lectures(topics, syllabus_classes)

    structured = []
    lecture_index = 0

    for i, week in enumerate(weeks):

        start = week["start"]
        end = week["end"]
        classes = weekly_classes[i]

        week_type = get_week_type(start, end, calendar)

        topics_this_week = []

        for _ in range(classes):

            if lecture_index < len(lecture_plan):

                topics_this_week.append(
                    f"{lecture_index + 1}. {lecture_plan[lecture_index]}"
                )

            else:

                topics_this_week.append(
                    f"{lecture_index + 1}. Revision / Doubt Solving"
                )

            lecture_index += 1

        topic_display = (
            "<br>".join(topics_this_week)
            if topics_this_week
            else week_type or "No Class"
        )

        holiday_texts = []

        for h in calendar["holidays"]:
            d = datetime.strptime(h, "%Y-%m-%d")
            if start <= d <= end:
                holiday_texts.append(d.strftime("%d %b"))

        structured.append({
            "week": week["week"],
            "date_range": f"{start.strftime('%d %b')} - {end.strftime('%d %b')}",
            "topic": topic_display,
            "holidays": ", ".join(holiday_texts) if holiday_texts else week_type or "None",
            "classes": classes
        })

    structured = merge_weeks(structured)

    # -------------------------------
    # FINAL MESSAGE
    # -------------------------------

    if total_classes < REQUIRED:
        msg = f"You have to take {REQUIRED - total_classes} extra classes to complete 42 lectures"

    elif total_classes == REQUIRED:
        msg = "Perfect! Syllabus aligned with 42 lectures"

    else:
        msg = f"Syllabus completed in 42 lectures. Remaining {total_classes - REQUIRED} classes are for revision"

    return {
        "lecture_plan": structured,
        "total_classes": total_classes,
        "message": msg
    }