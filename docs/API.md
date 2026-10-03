# ArchAI REST API Specification

## 1. Overview & Base URL
- **Base URL**: `/api/v1`
- **Protocol**: HTTPS / WSS / SSE
- **Authentication**: Bearer JWT (Authorization: `Bearer <token>`)
- **Content-Type**: `application/json`

---

## 2. Authentication Endpoints

### `POST /api/v1/auth/register`
- **Description**: Registers a new user.
- **Request**:
```json
{
  "email": "architect@example.com",
  "password": "SecurePassword123!",
  "full_name": "Lead Architect"
}
```
- **Response** (201 Created):
```json
{
  "user": { "id": "uuid", "email": "architect@example.com", "full_name": "Lead Architect", "role": "user" },
  "access_token": "jwt_token_string",
  "token_type": "bearer"
}
```

### `POST /api/v1/auth/login`
- **Description**: Authenticates user and returns JWT token.
- **Request**:
```json
{
  "email": "architect@example.com",
  "password": "SecurePassword123!"
}
```
- **Response** (200 OK):
```json
{
  "user": { "id": "uuid", "email": "architect@example.com", "full_name": "Lead Architect", "role": "user" },
  "access_token": "jwt_token_string",
  "token_type": "bearer"
}
```

### `POST /api/v1/auth/demo-login`
- **Description**: Instant guest/demo login without credentials.
- **Response** (200 OK): Returns pre-seeded demo user and token.

---

## 3. Project Management Endpoints

### `POST /api/v1/projects`
- **Description**: Create a new architecture project.
- **Request**:
```json
{
  "name": "Local Services Marketplace",
  "description": "On-demand home services platform connecting contractors and homeowners.",
  "industry": "Home Services / Marketplace",
  "target_users": "Homeowners, Independent Contractors, Admin",
  "business_objective": "Facilitate instant booking and secure escrow payments.",
  "scale_tier": "High Growth (100k+ MAU)",
  "tech_preferences": "Next.js, FastAPI, PostgreSQL, Redis, Stripe",
  "raw_idea": "I want to build an online marketplace for local service providers where customers can search providers, compare prices, book appointments and pay online."
}
```
- **Response** (201 Created): Returns Project object.

### `GET /api/v1/projects`
- **Description**: List all projects for authenticated user.

### `GET /api/v1/projects/{id}`
- **Description**: Retrieve detailed project state by ID.

### `PATCH /api/v1/projects/{id}`
- **Description**: Update project metadata or settings.

### `DELETE /api/v1/projects/{id}`
- **Description**: Soft or hard delete a project.

---

## 4. Requirements & Follow-up Q&A Endpoints

### `POST /api/v1/projects/{id}/analyze`
- **Description**: Initiates Requirement Analyst agent to parse raw idea, extract actors, functional/non-functional requirements, constraints, risks, and generate targeted follow-up questions.
- **Response** (200 OK):
```json
{
  "project_summary": "...",
  "business_goals": [...],
  "actors": [...],
  "functional_requirements": [...],
  "non_functional_requirements": [...],
  "constraints": [...],
  "assumptions": [...],
  "risks": [...],
  "questions": [
    {
      "id": "q1",
      "question_text": "How should payments and escrow be handled between homeowners and contractors?",
      "category": "Payments",
      "options": ["Stripe Connect Marketplace", "PayPal Commerce", "Direct Bank ACH", "Other"],
      "priority": "HIGH"
    }
  ]
}
```

### `GET /api/v1/projects/{id}/requirements`
- **Description**: Fetch current requirements state and questions.

### `POST /api/v1/projects/{id}/questions/answer`
- **Description**: Submit user answers to follow-up questions.
- **Request**:
```json
{
  "answers": [
    {
      "question_id": "q1",
      "selected_option": "Stripe Connect Marketplace",
      "custom_text": "Hold payout in escrow until service marked completed by customer."
    }
  ]
}
```

### `POST /api/v1/projects/{id}/finalize`
- **Description**: Synthesizes answers into finalized SRS baseline with user stories and acceptance criteria.
- **Request**: Optional edits to requirements.
- **Response** (200 OK): Returns finalized SRS and updates project status to `FINALIZING` / ready for orchestration.

---

## 5. Multi-Agent Orchestration Endpoints

### `POST /api/v1/projects/{id}/orchestrate`
- **Description**: Starts the 10-agent orchestration pipeline.
- **Response** (202 Accepted):
```json
{
  "agent_run_id": "uuid",
  "status": "RUNNING",
  "current_stage": "STAGE_2",
  "message": "Orchestration pipeline started."
}
```

### `GET /api/v1/projects/{id}/agent-runs`
- **Description**: List all agent execution runs and token/latency metrics for the project.

### `GET /api/v1/projects/{id}/agent-runs/{run_id}`
- **Description**: Get status, stage, individual agent tasks, logs, and token usage for a specific run.

### `GET /api/v1/projects/{id}/stream` (SSE)
- **Description**: Server-Sent Events stream delivering real-time agent status changes, logs, token counts, and stage transitions.

---

## 6. Deliverables & Artifacts Endpoints

### `GET /api/v1/projects/{id}/artifacts`
- **Description**: List all generated artifacts (SRS, Architecture, ERD, SQL, API, Security, Testing, Deployment, ADRs).

### `GET /api/v1/projects/{id}/artifacts/{artifact_id}`
- **Description**: Fetch artifact details and markdown/JSON content.

### `PUT /api/v1/projects/{id}/artifacts/{artifact_id}`
- **Description**: Update artifact content and create a new version.

### `GET /api/v1/projects/{id}/architecture`
- **Description**: Get React Flow / Mermaid system architecture graph node/edge definitions.

### `GET /api/v1/projects/{id}/database`
- **Description**: Get database ERD schema and generated SQL DDL.

### `GET /api/v1/projects/{id}/api-spec`
- **Description**: Get OpenAPI 3.1 specification JSON.

### `GET /api/v1/projects/{id}/security`
- **Description**: Get threat model and OWASP security matrix.

### `GET /api/v1/projects/{id}/testing`
- **Description**: Get test strategy and test cases.

### `GET /api/v1/projects/{id}/deployment`
- **Description**: Get Docker, CI/CD, and cost breakdown plans.

### `GET /api/v1/projects/{id}/validation`
- **Description**: Get consistency validation report (identifies contradictions, mismatches, gaps).

---

## 7. RAG & Knowledge Documents Endpoints

### `POST /api/v1/projects/{id}/documents`
- **Description**: Upload architecture standard / guideline documents (PDF, MD, TXT, DOCX).

### `GET /api/v1/projects/{id}/documents`
- **Description**: List uploaded and ingested documents.

### `POST /api/v1/projects/{id}/documents/search`
- **Description**: Test semantic vector search against project knowledge base.

---

## 8. Export Endpoints

### `POST /api/v1/projects/{id}/export`
- **Description**: Export full architecture blueprint in requested format (`zip`, `markdown`, `json`, `sql`, `openapi`).
- **Response**: Binary download or JSON payload.

---

## 9. System & Observability Endpoints

### `GET /api/v1/health`
- **Description**: System health status (DB, Redis, LLM, Vector engine).
### `GET /api/v1/admin/metrics`
- **Description**: Aggregate tokens, latency, cost estimates, project counts.
