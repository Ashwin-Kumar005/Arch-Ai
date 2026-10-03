# ArchAI - AI Software Solution Architect

> **From Idea to Architecture in Minutes**  
> Enterprise-grade autonomous multi-agent platform that transforms natural-language software concepts into production-ready technical software blueprints.

---

## 🚀 Key Capabilities & Highlights
- **10 Autonomous Domain Agents**: Requirement Analyst, Product Manager, Solution Architect, Database Architect, Backend Engineer, Frontend Planner, DevOps Engineer, Security Expert, QA Engineer, and Technical Writer.
- **Dependency-Aware Stage Graph**: Non-blocking asynchronous execution with live Server-Sent Events (SSE) telemetry.
- **Cross-Domain Validation Engine**: Automated consistency checking detecting contradictions between architecture, API, database, security, and requirements.
- **Production Artifacts**: Interactive React Flow topology, PostgreSQL DDL schemas, OpenAPI 3.1 specifications, STRIDE threat models, CI/CD pipelines, and cloud cost calculations.
- **Dual-Mode Engine**: Instant zero-dependency `DEMO_MODE=true` for testing/demoing without external API keys, with full support for Google Gemini in production.
- **Multi-Format Export**: One-click download of full blueprint bundles as ZIP, Markdown, JSON, SQL, or OpenAPI YAML.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, TanStack Query, React Flow, Lucide Icons, Monaco Editor.
- **Backend API**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, PostgreSQL / SQLite.
- **AI & RAG**: Google Gemini API, pgvector semantic search, untrusted context isolation sandbox (`<UNTRUSTED_CONTEXT>`), token telemetry.
- **DevOps**: Docker, Docker Compose, Nginx reverse proxy, GitHub Actions CI/CD.

---

## 📦 Monorepo Architecture
```
archai/
├── apps/
│   ├── web/                    # Next.js 14+ frontend application
│   └── api/                    # FastAPI backend application & agent orchestrator
├── packages/
│   ├── shared-types/           # Shared TypeScript type definitions
│   ├── agent-contracts/        # Pydantic schemas for agent I/O
│   └── prompts/                # Versioned prompt markdown files
├── docs/                       # Architecture documentation & ADRs
├── infra/                      # Docker, Nginx, and monitoring topology
├── scripts/                    # Seed and automated verification scripts
└── docker-compose.yml
```

---

## ⚡ Quickstart

### Prerequisites
- Python >= 3.12
- Node.js >= 20.x
- Docker & Docker Compose (Optional for containerized run)

### 1. Installation
```bash
# Install backend dependencies
cd apps/api
pip install -r requirements.txt

# Install frontend dependencies
cd ../web
npm install
```

### 2. Seed Demo Data & Start Services
```bash
# Terminal 1: Start Backend API
cd apps/api
python -m app.db.seed
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start Frontend Web App
cd apps/web
npm run dev -- -p 3000
```
Open **http://localhost:3000** in your browser to access the ArchAI platform.

---

## 🧪 Testing & Verification
```bash
# Run all 20 backend unit, integration, and E2E tests
cd apps/api
pytest tests/ -v

# Run frontend build verification
cd apps/web
npm run build

# Run automated standalone E2E pipeline verification
python scripts/verify_e2e.py
```

---

## 🐳 Docker Deployment
```bash
# Start full containerized stack (Web, API, DB, Redis, Worker)
docker compose up --build -d

# Check service health
docker compose ps
```

---

## 📄 License
MIT License
