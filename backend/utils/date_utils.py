from datetime import datetime, timedelta


def generate_valid_dates(start_date, end_date, lecture_days, holidays=[]):

    valid_dates = []

    current = start_date

    while current <= end_date:

        weekday = current.strftime("%A")

        if weekday in lecture_days and current not in holidays:

            valid_dates.append(current)

        current += timedelta(days=1)

    return valid_dates