def distribute_topics(topics, lecture_dates):

    schedule = []

    topic_index = 0

    for i, date in enumerate(lecture_dates):

        if topic_index >= len(topics):
            break

        schedule.append({

            "date": str(date),
            "lecture_no": i + 1,
            "topic": topics[topic_index]

        })

        topic_index += 1

    return schedule