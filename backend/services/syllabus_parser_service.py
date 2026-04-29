from services.gemini_service import generate_answer


def extract_topics_from_syllabus(text):

    prompt = """
Extract structured lecture topics from this syllabus.

Return output as:

Topic 1
Topic 2
Topic 3
"""

    topics = generate_answer(text, prompt)

    return topics.split("\n")