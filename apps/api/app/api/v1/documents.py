"""
Documents and RAG Search API Router
"""

from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.document import DocumentOut, SearchQueryRequest, SearchResultItem
from app.services.document_service import DocumentService
from app.rag.retriever import RAGRetriever

router = APIRouter(prefix="/projects", tags=["Documents & RAG"])


@router.post("/{project_id}/documents", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    project_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        return await DocumentService.upload_document(db, project_id, file)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}/documents", response_model=List[DocumentOut])
def list_documents(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return DocumentService.get_project_documents(db, project_id)


@router.post("/{project_id}/documents/search", response_model=List[SearchResultItem])
async def search_documents(
    project_id: str,
    payload: SearchQueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    retriever = RAGRetriever(db)
    return await retriever.search(project_id, payload.query, top_k=payload.top_k)
