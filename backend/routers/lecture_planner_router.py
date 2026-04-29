from fastapi import APIRouter, UploadFile, File, Form
from datetime import datetime
from services.pdf_service import extract_text_from_pdf
from services.syllabus_parser_service import extract_topics_from_syllabus
from services.planner_distribution_service import distribute_topics
from utils.date_utils import generate_valid_dates

router = APIRouter()


@router.post("/lecture-planner-agent")

async def generate_lecture_plan(

        syllabus: UploadFile = File(...),

        start_date: str = Form(...),

        end_date: str = Form(...),

        lecture_days: str = Form(...)

):

    # convert dates

    start = datetime.strptime(start_date, "%Y-%m-%d")

    end = datetime.strptime(end_date, "%Y-%m-%d")

    lecture_days = lecture_days.split(",")

    # extract syllabus text

    text = extract_text_from_pdf(syllabus)

    # extract topics

    topics = extract_topics_from_syllabus(text)

    # generate valid lecture dates

    lecture_dates = generate_valid_dates(

        start,
        end,
        lecture_days

    )

    # distribute topics

    schedule = distribute_topics(

        topics,
        lecture_dates

    )

    return {

        "lecture_plan": schedule

    }