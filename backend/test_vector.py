from services.gemini_service import generate_embedding
from vector_store.faiss_store import store


chunks = [
    "Machine learning is a subset of artificial intelligence.",
    "Deep learning uses neural networks.",
    "FAISS helps with similarity search.",
    "Gemini provides embeddings."
]

embeddings = []

for chunk in chunks:

    emb = generate_embedding(chunk)

    embeddings.append(emb)


store.create_index(embeddings, chunks)


query = "What is machine learning?"

query_embedding = generate_embedding(query)

results = store.search(query_embedding)

print("\nTop Results:\n")

for r in results:
    print("-", r)