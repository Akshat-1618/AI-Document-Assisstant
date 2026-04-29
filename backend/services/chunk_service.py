import re


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100):

    """
    Improved semantic-aware chunking

    Splits text by sentences first, then builds chunks
    instead of breaking mid-word or mid-sentence.
    """

    # Split into sentences
    sentences = re.split(r'(?<=[.!?]) +', text)

    chunks = []
    current_chunk = ""

    for sentence in sentences:

        if len(current_chunk) + len(sentence) <= chunk_size:
            current_chunk += " " + sentence

        else:
            chunks.append(current_chunk.strip())

            # overlap logic
            current_chunk = current_chunk[-overlap:] + sentence

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks