# ADR 003: Relational Persistence with PostgreSQL

## Status
Accepted

## Context
ArchAI manages deeply interconnected models (users, projects, requirements, Q&A, agents, runs, tasks, and versioned artifacts) that require ACID compliance, foreign key integrity, and JSONB document support.

## Decision
We chose **PostgreSQL 16** managed via **SQLAlchemy 2.0** and **Alembic**, with seamless SQLite fallback for local developer agility.
