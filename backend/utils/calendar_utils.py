import json
import os


def load_calendar():

    current_dir = os.path.dirname(__file__)

    file_path = os.path.join(
        current_dir,
        "academic_calendar.json"
    )

    with open(file_path) as f:

        return json.load(f)["even_sem_2026"]


def is_holiday(date_str, calendar):

    return date_str in calendar["holidays"]


def is_exam_day(date_str, calendar):

    exams = calendar["exams"]

    for exam in exams.values():

        if exam["start"] <= date_str <= exam["end"]:

            return True

    return False


def is_break_day(date_str, calendar):

    for b in calendar["breaks"]:

        if b["start"] <= date_str <= b["end"]:

            return True

    return False