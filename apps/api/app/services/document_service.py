"""
Document Management and Ingestion Service Layer
"""

import os
import shutil
from typing import List, Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.document import Document, DocumentChunk
from app.rag.chunker import extract_text_from_file, chunk_text
from app.llm.factory import get_llm_provider


class DocumentService:
    @staticmethod
    async def upload_document(db: Session, project_id: str, file: UploadFile) -> Document:
        file_ext = file.filename.split(".")[-1].lower() if "." in file.filename else "txt"
        project_upload_dir = settings.UPLOADS_DIR / project_id
        os.makedirs(project_upload_dir, exist_ok=True)
        target_path = project_upload_dir / file.filename

        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(target_path)

        doc = Document(
            project_id=project_id,
            filename=file.filename,
            file_type=file_ext,
            file_size=file_size,
            storage_path=str(target_path),
            processed=False
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # Ingest and embed asynchronously
        await DocumentService.process_document(db, doc.id)

        return doc

    @staticmethod
    async def process_document(db: Session, document_id: str):
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            return

        text = extract_text_from_file(doc.storage_path, doc.file_type)
        if not text:
            doc.processed = True
            db.commit()
            return

        chunks_data = chunk_text(text, chunk_size=400, chunk_overlap=80)
        llm = get_llm_provider()

        for c in chunks_data:
            embedding_vec = await llm.get_embedding(c["text_content"])
            chunk_obj = DocumentChunk(
                document_id=doc.id,
                chunk_index=c["chunk_index"],
                text_content=c["text_content"],
                token_count=c["token_count"],
                embedding=embedding_vec,
                metadata_json={"filename": doc.filename, "file_type": doc.file_type}
            )
            db.add(chunk_obj)

        doc.processed = True
        db.commit()

    @staticmethod
    def get_project_documents(db: Session, project_id: str) -> List[Document]:
        docs = db.query(Document).filter(Document.project_id == project_id).all()
        for d in docs:
            d.chunks_count = db.query(DocumentChunk).filter(DocumentChunk.document_id == d.id).count()
        return docs
