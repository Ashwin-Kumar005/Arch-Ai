"""
Document Text Extraction and Chunking Pipeline
"""

import os
from typing import List, Dict, Any
from pathlib import Path


def extract_text_from_file(file_path: str, file_type: str) -> str:
    path = Path(file_path)
    if not path.exists():
        return ""

    file_type = file_type.lower()

    if file_type in ["txt", "md", "markdown", "json", "yaml", "yml"]:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    elif file_type == "pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(str(path))
            text = ""
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
            return text
        except Exception:
            return ""

    elif file_type in ["docx", "doc"]:
        try:
            import docx
            doc = docx.Document(str(path))
            return "\n".join([para.text for para in doc.paragraphs if para.text])
        except Exception:
            return ""

    return ""


def chunk_text(text: str, chunk_size: int = 600, chunk_overlap: int = 100) -> List[Dict[str, Any]]:
    """
    Chunks input text with specified size and overlap, returning structured chunks.
    """
    if not text:
        return []

    words = text.split()
    if len(words) <= chunk_size:
        return [{
            "chunk_index": 0,
            "text_content": text.strip(),
            "token_count": len(words)
        }]

    chunks = []
    start = 0
    chunk_index = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk_words = words[start:end]
        chunk_str = " ".join(chunk_words)

        chunks.append({
            "chunk_index": chunk_index,
            "text_content": chunk_str,
            "token_count": len(chunk_words)
        })

        chunk_index += 1
        start += (chunk_size - chunk_overlap)
        if start >= len(words) - chunk_overlap:
            break

    return chunks
