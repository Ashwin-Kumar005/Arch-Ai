"""
RAG Retriever Service
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.rag.vector_store import VectorStore
from app.llm.factory import get_llm_provider


class RAGRetriever:
    def __init__(self, db: Session):
        self.db = db
        self.vector_store = VectorStore(db)
        self.llm = get_llm_provider()

    async def retrieve_context_for_project(self, project_id: str, query: str, top_k: int = 3) -> str:
        query_embedding = await self.llm.get_embedding(query)
        results = self.vector_store.search(project_id, query_embedding, top_k=top_k)
        return self.vector_store.format_retrieved_context(results)

    async def search(self, project_id: str, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        query_embedding = await self.llm.get_embedding(query)
        return self.vector_store.search(project_id, query_embedding, top_k=top_k)
