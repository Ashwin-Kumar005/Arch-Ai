# ADR 007: Authentication, Session & Role Authorization

## Status
Accepted

## Context
ArchAI must support guest demo access, standard user accounts, and administrator roles with RBAC and secure token generation.

## Decision
We chose stateless JWT with bcrypt password hashing, scoped role middleware, project-level tenant authorization, and a one-click instant demo access endpoint.
