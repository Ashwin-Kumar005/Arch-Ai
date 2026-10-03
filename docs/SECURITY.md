# ArchAI Security Architecture & Controls

## 1. Security Overview
ArchAI is built around a defense-in-depth security model protecting user intellectual property, API keys, AI agent workflows, and database layers against external attacks and indirect prompt injection.

## 2. Authentication & Authorization
- **JWT Authentication**: Passwords hashed using bcrypt. Access tokens issued via HMAC-SHA256 with standard expiration.
- **Role-Based Access Control (RBAC)**:
  - `admin`: Full platform control, user management, global observability, system config.
  - `user`: Create, update, orchestrate, and export owned architecture projects.
  - `guest`: Read-only or sandbox interactive exploration in Demo Mode.
- **Tenant Isolation**: Projects are strictly partitioned by `owner_id` and `project_members`. All database queries and RAG vector lookups enforce `project_id` tenant scoping.

## 3. AI Safety & Prompt Injection Defenses
- **Untrusted Context Isolation**: Documents ingested via RAG or custom user inputs are strictly encapsulated in `<UNTRUSTED_CONTEXT>` tags with explicit model instructions to ignore instructions inside user text.
- **No Direct Shell Execution**: Agents have no access to raw shell or OS execution tools. All agent tools are sandboxed, typed Pydantic functions.
- **Structured Output Enforcement**: Free-form text cannot directly alter system states. All outputs are parsed and validated via Pydantic schemas before persistence.

## 4. Application Security Controls
- **Input Validation**: Strict request payload validation using Pydantic on the backend and Zod on the frontend.
- **SQL Injection Prevention**: 100% parameterized queries via SQLAlchemy 2.0 ORM.
- **XSS Prevention**: React DOM auto-escaping and sanitized Markdown rendering.
- **CORS & Security Headers**: Strict CORS origin whitelisting, Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options.
- **Rate Limiting**: Endpoint-level rate limiting on sensitive routes (`/auth/login`, `/analyze`, `/orchestrate`).
- **Audit Logging**: Comprehensive audit trail for project creation, role modification, orchestration executions, and document uploads.
