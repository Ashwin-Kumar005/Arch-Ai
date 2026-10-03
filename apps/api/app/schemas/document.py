"""
Document and RAG Pydantic Schemas
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class DocumentOut(BaseModel):
    id: str
    project_id: str
    filename: str
    file_type: str
    file_size: int
    processed: bool
    created_at: datetime
    chunks_count: Optional[int] = 0

    class Config:
        from_attributes = True


class SearchQueryRequest(BaseModel):
    query: str
    top_k: int = 4


class SearchResultItem(BaseModel):
    chunk_id: str
    document_id: str
    filename: str
    text_content: str
    similarity_score: float
    metadata: Dict[str, Any] = {}
