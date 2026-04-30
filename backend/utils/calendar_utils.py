# utils/calendar_utils.py

import json
import os

from datetime import datetime


# -----------------------------------
# Load Academic Calendar
# -----------------------------------

def load_calendar():

    current_dir = os.path.dirname(__file__)

    file_path = os.path.join(
        current_dir,
        "academic_calendar.json"
    )

    with open(file_path) as f:

        return json.load(f)["even_sem_2026"]


# -----------------------------------
# Generic overlap checker
# -----------------------------------

def date_overlap(
    start1,
    end1,
    start2,
    end2
):

    return start1 <= end2 and start2 <= end1


# -----------------------------------
# Check if week overlaps exam
# -----------------------------------

def is_exam_week(
    week_start,
    week_end,
    calendar
):

    exams = calendar["exams"]

    for exam in exams.values():

        exam_start = datetime.strptime(
            exam["start"],
            "%Y-%m-%d"
        )

        exam_end = datetime.strptime(
            exam["end"],
            "%Y-%m-%d"
        )

        if date_overlap(
            week_start,
            week_end,
            exam_start,
            exam_end
        ):

            return True

    return False


# -----------------------------------
# Check if week overlaps break
# -----------------------------------

def is_break_week(
    week_start,
    week_end,
    calendar
):

    for b in calendar["breaks"]:

        break_start = datetime.strptime(
            b["start"],
            "%Y-%m-%d"
        )

        break_end = datetime.strptime(
            b["end"],
            "%Y-%m-%d"
        )

        if date_overlap(
            week_start,
            week_end,
            break_start,
            break_end
        ):

            return True

    return False


# -----------------------------------
# Check holiday inside week
# -----------------------------------

def has_holiday_in_week(
    week_start,
    week_end,
    calendar
):

    holidays = calendar["holidays"]

    for h in holidays:

        holiday_date = datetime.strptime(
            h,
            "%Y-%m-%d"
        )

        if week_start <= holiday_date <= week_end:

            return True

    return False