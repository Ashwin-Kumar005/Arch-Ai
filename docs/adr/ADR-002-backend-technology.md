# ADR 002: Backend Framework & Architecture

## Status
Accepted

## Context
The ArchAI backend must support high-throughput asynchronous execution, long-running agent workflows, typed validation schemas, OpenAPI auto-generation, and real-time Server-Sent Events (SSE).

## Decision
We chose **Python 3.12+** with **FastAPI**, **Pydantic v2**, and **SQLAlchemy 2.0**.

## Consequences
- **Pros**: Direct integration with Python AI/LLM libraries, native async/await for parallel agent steps, Pydantic type safety, and automatic OpenAPI 3.1 documentation.
- **Cons**: Requires ASGI server (Uvicorn) and careful task orchestration.
