import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# -------------------------
# EMBEDDING FUNCTION
# -------------------------

def generate_embedding(text: str):

    retries = 3

    for attempt in range(retries):

        try:

            response = client.models.embed_content(
                model="gemini-embedding-001",
                contents=text,
                config=types.EmbedContentConfig(
                    task_type="RETRIEVAL_QUERY",
                    output_dimensionality=768
                )
            )

            return response.embeddings[0].values

        except Exception as e:

            if attempt < retries - 1:
                print("Retrying embedding request...")
                time.sleep(2)
            else:
                raise e


# -------------------------
# GENERATE ANSWER FUNCTION
# -------------------------

def generate_answer(context: str, question: str):

    prompt = f"""
You are a helpful AI assistant.

Answer the question using ONLY the context below.

Context:
{context}

Question:
{question}
"""

    retries = 3

    for attempt in range(retries):

        try:

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:

            print(f"Gemini attempt {attempt+1} failed")

            # retry if server busy / quota spike
            if attempt < retries - 1:
                time.sleep(3)

            else:
                raise e