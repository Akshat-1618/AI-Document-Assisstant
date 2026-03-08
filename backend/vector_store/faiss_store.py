import faiss
import numpy as np
import os
import json


class FAISSStore:

    def __init__(self):

        os.makedirs("data/faiss_index", exist_ok=True)

        self.index = None
        self.chunks = []

        self.index_path = "data/faiss_index/index.faiss"
        self.chunk_path = "data/faiss_index/chunks.json"


    def create_index(self, embeddings, chunks):
        """
        Create FAISS index and store embeddings.
        """

        dimension = len(embeddings[0])

        self.index = faiss.IndexFlatL2(dimension)

        vectors = np.array(embeddings).astype("float32")

        self.index.add(vectors)

        self.chunks = chunks

        self.save_index()
        self.save_chunks()


    def save_index(self):
        """
        Save FAISS index
        """

        if self.index is not None:
            faiss.write_index(self.index, self.index_path)


    def save_chunks(self):
        """
        Save chunks to disk
        """

        with open(self.chunk_path, "w") as f:
            json.dump(self.chunks, f)


    def load_index(self):
        """
        Load FAISS index
        """

        if os.path.exists(self.index_path):

            self.index = faiss.read_index(self.index_path)

            with open(self.chunk_path) as f:
                self.chunks = json.load(f)


    def search(self, query_embedding, k=3):
        """
        Search similar chunks
        """

        query_vector = np.array([query_embedding]).astype("float32")

        distances, indices = self.index.search(query_vector, k)

        results = []

        for i in indices[0]:

            if i < len(self.chunks):
                results.append(self.chunks[i])

        return results


store = FAISSStore()