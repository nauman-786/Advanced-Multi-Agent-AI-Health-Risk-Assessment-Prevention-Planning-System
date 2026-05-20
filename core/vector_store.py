import chromadb
import uuid
import json
from typing import List, Dict

# Initialize a local ChromaDB client that saves data to the 'data/chroma_db' folder
client = chromadb.PersistentClient(path="./data/chroma_db")

# Create or connect to a collection for our patients
try:
    collection = client.get_or_create_collection(name="patients")
except Exception:
    collection = client.create_collection(name="patients")

def find_similar_patients(profile_dict: Dict) -> List[Dict]:
    """
    Takes a patient profile, converts it to a text document for embedding,
    and searches the ChromaDB vector store for the most similar past patients.
    """
    # We convert the dictionary to a JSON string so Chroma can embed it
    doc_text = json.dumps(profile_dict, sort_keys=True)
    
    # If the database is completely empty (first time running),
    # add this patient so we have at least one record, then return it.
    if collection.count() == 0:
        collection.add(
            documents=[doc_text],
            metadatas=[profile_dict], # Store the actual dict as metadata for easy retrieval
            ids=[str(uuid.uuid4())]
        )
        return [profile_dict]
    
    # Search for the top 5 most similar patients
    results = collection.query(
        query_texts=[doc_text],
        n_results=min(5, collection.count())
    )
    
    # Return the metadata dictionaries of the similar patients
    if results["metadatas"] and len(results["metadatas"]) > 0:
        return results["metadatas"][0] 
    
    return []