# ArchAI System Architecture

## 1. High-Level Architecture Overview
ArchAI is engineered as a decoupled, asynchronous, production-oriented monorepo consisting of:
1. **Frontend (`apps/web`)**: Next.js 14+ App Router, React, TypeScript, Tailwind CSS, TanStack Query, Lucide Icons, React Flow diagramming, Monaco Editor integrations, and real-time SSE/WebSocket clients.
2. **Backend API (`apps/api`)**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy ORM, Alembic migrations, LangGraph-style agent orchestration engine, and hybrid RAG subsystem.
3. **Packages (`packages/`)**: Versioned system prompts (`packages/prompts`), typed agent contract schemas (`packages/agent-contracts`), and shared TypeScript/Pydantic types (`packages/shared-types`).
4. **Data Layer**: PostgreSQL 16 with pgvector extension (with SQLite in-memory fallback for zero-dependency local running & testing), Redis 7+ for caching & job pub/sub.
5. **Infrastructure (`infra/`)**: Multi-stage Docker containers, Docker Compose, Nginx reverse proxy configuration, Prometheus/OpenTelemetry metrics.

```
+-------------------------------------------------------------------------+
|                        Browser / Client Layer                           |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | Next.js App Router |  | React Flow Diagram |  | Live SSE Monitor  |  |
|  +--------------------+  +--------------------+  +-------------------+  |
+------------------------------------+------------------------------------+
                                     | (HTTPS / WSS / SSE)
                                     v
+-------------------------------------------------------------------------+
|                        API Gateway / FastAPI Core                       |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | Auth & RBAC (JWT)  |  | Rate Limiting      |  | Security Guards   |  |
|  +--------------------+  +--------------------+  +-------------------+  |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | Project Controllers|  | RAG & Ingestion    |  | Export Engine     |  |
|  +--------------------+  +--------------------+  +-------------------+  |
+------------------------------------+------------------------------------+
                                     |
    +--------------------------------+-------------------------------+
    |                                                                |
    v                                                                v
+-----------------------------+                     +-------------------------------+
|  Multi-Agent Orchestrator   |                     |     RAG Knowledge Subsystem   |
|  +-----------------------+  |                     |  +-------------------------+  |
|  | State Graph Engine    |  |                     |  | Document Parser (PDF/MD)|  |
|  +-----------------------+  |                     |  +-------------------------+  |
|  | 10 Specialized Agents |  |                     |  | Chunker & Embedder      |  |
|  +-----------------------+  |                     |  +-------------------------+  |
|  | Validation Engine     |  |                     |  | Vector Store (pgvector) |  |
|  +-----------------------+  |                     |  +-------------------------+  |
+--------------+--------------+                     +---------------+---------------+
               |                                                    |
               v                                                    v
+-------------------------------------------------------------------------+
|                        Persistence & Vector Data                        |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | PostgreSQL DB      |  | pgvector Storage   |  | Redis Event Cache |  |
|  +--------------------+  +--------------------+  +-------------------+  |
+-------------------------------------------------------------------------+
```

## 2. Component Design Principles
- **Loose Coupling & High Cohesion**: Every AI agent executes against explicit Pydantic input/output schemas with strict schema validation.
- **Pluggable LLM Providers**: Abstract `LLMProvider` base with implementations for `GeminiProvider` (production) and deterministic `MockProvider` (demo & testing mode).
- **Asynchronous & Non-Blocking**: Long-running multi-agent pipelines execute asynchronously with real-time status streaming via SSE.
- **Fail-Safe & Resilient**: Independent agent retries with exponential backoff and graceful degradation if individual agents fail.
- **Defense in Depth**: Retrieved context from user uploads is tagged with `<UNTRUSTED_CONTEXT>` to prevent indirect prompt injection.

## 3. Directory Layout
```
archai/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/                # App router pages & layouts
│   │   ├── components/         # Reusable UI & visualizer components
│   │   ├── features/           # Feature modules (projects, agents, artifacts, erd, api)
│   │   ├── hooks/              # Custom React hooks (SSE, query, debounce)
│   │   ├── lib/                # API client, utilities, formatting
│   │   └── types/              # TypeScript definitions
│   └── api/                    # FastAPI backend application
│       ├── app/
│       │   ├── api/            # API route controllers (v1 endpoints)
│       │   ├── core/           # Security, config, logging, telemetry
│       │   ├── db/             # Session management, migrations, engine
│       │   ├── models/         # SQLAlchemy 2.0 ORM models
│       │   ├── schemas/        # Pydantic v2 schemas
│       │   ├── services/       # Business logic services
│       │   ├── agents/         # 10 specialized agent implementations & validator
│       │   ├── rag/            # Vector store, chunking, retrieval, embeddings
│       │   ├── workers/        # Background orchestrator runners
│       │   └── security/       # Sanitization, prompt defense, RBAC
│       └── tests/              # Pytest backend test suite
├── packages/
│   ├── shared-types/           # Common data definitions
│   ├── agent-contracts/        # Pydantic/JSON schemas for agent I/O
│   └── prompts/                # Versioned prompt markdown files
├── docs/                       # Architecture & technical documentation
├── infra/                      # Docker, Nginx, monitoring configs
└── scripts/                    # Seed scripts, E2E runners, migrations
```
