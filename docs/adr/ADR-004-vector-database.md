# ADR 004: Vector Search & RAG Architecture

## Status
Accepted

## Context
ArchAI grounds agent decisions in uploaded enterprise architecture standards, API guidelines, and compliance documentation.

## Decision
We chose **PostgreSQL pgvector** as the default production vector store, paired with an in-memory cosine-similarity fallback and an untrusted context isolation sandbox (`<UNTRUSTED_CONTEXT>`).
