# ADR 006: Multi-Agent Dependency Graph Orchestration

## Status
Accepted

## Context
10 specialized agents need to execute in dependency stages (e.g. Solution Architect must complete before Database, Backend, and Frontend can proceed; DevOps, Security, QA run next in parallel; followed by consistency validation and Technical Writer synthesis).

## Decision
We implemented a non-blocking asynchronous Stage Graph Orchestrator with real-time SSE telemetry, independent retry loops, and token accounting.
