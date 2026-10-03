# ArchAI Deployment & Operations Guide

## 1. Local Development Setup
ArchAI is configured for instantaneous local development in dual modes:

### Quickstart (Zero-Dependency Local Mode)
Runs with SQLite + in-memory vector embeddings and deterministic Demo Mode:
```bash
# Backend Setup
cd apps/api
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m app.db.seed      # Seed initial demo data
uvicorn app.main:app --reload --port 8000

# Frontend Setup
cd apps/web
npm install
npm run dev -- --port 3000
```

## 2. Docker & Containerized Production
ArchAI includes a production-grade multi-container topology using Docker Compose:
- **`web`**: Next.js optimized Node.js standalone runtime container.
- **`api`**: FastAPI high-performance Uvicorn ASGI server.
- **`worker`**: Background agent orchestrator worker.
- **`postgres`**: PostgreSQL 16 with `pgvector/pgvector:pg16` image.
- **`redis`**: Redis 7+ cache & message broker.

```bash
# Start complete stack with Docker Compose
docker compose up --build -d

# Run database migrations
docker compose exec api alembic upgrade head

# Seed demo dataset
docker compose exec api python -m app.db.seed
```

## 3. Environment Variables Specification
Refer to `.env.example` for all configurable variables including `DEMO_MODE`, `LLM_PROVIDER`, `GEMINI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, and `JWT_SECRET`.
