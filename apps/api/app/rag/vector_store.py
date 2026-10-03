"""
Vector Store & Similarity Engine
"""

import math
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.document import Document, DocumentChunk
from app.rag.sanitizer import wrap_in_untrusted_context


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(v1, v2))
    magnitude1 = math.sqrt(sum(a * a for a in v1))
    magnitude2 = math.sqrt(sum(b * b for b in v2))
    if magnitude1 == 0.0 or magnitude2 == 0.0:
        return 0.0
    return dot_product / (magnitude1 * magnitude2)


class VectorStore:
    def __init__(self, db: Session):
        self.db = db

    def search(self, project_id: str, query_embedding: List[float], top_k: int = 4) -> List[Dict[str, Any]]:
        # Query all chunks belonging to this project
        chunks = (
            self.db.query(DocumentChunk)
            .join(Document, DocumentChunk.document_id == Document.id)
            .filter(Document.project_id == project_id)
            .all()
        )

        if not chunks:
            return []

        scored_chunks: List[Tuple[float, DocumentChunk]] = []
        for chunk in chunks:
            if chunk.embedding:
                score = cosine_similarity(query_embedding, chunk.embedding)
                scored_chunks.append((score, chunk))
            else:
                # Text similarity fallback
                scored_chunks.append((0.5, chunk))

        # Sort descending by score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        top_results = scored_chunks[:top_k]

        results = []
        for score, chunk in top_results:
            results.append({
                "chunk_id": chunk.id,
                "document_id": chunk.document_id,
                "filename": chunk.document.filename if chunk.document else "document",
                "text_content": chunk.text_content,
                "similarity_score": round(score, 4),
                "metadata": chunk.metadata_json or {}
            })

        return results

    def format_retrieved_context(self, search_results: List[Dict[str, Any]]) -> str:
        if not search_results:
            return ""

        context_blocks = []
        for res in search_results:
            block = wrap_in_untrusted_context(
                context_text=res["text_content"],
                source_name=f"{res['filename']} (score: {res['similarity_score']})"
            )
            context_blocks.append(block)

        return "\n".join(context_blocks)
