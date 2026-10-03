# ADR 001: Frontend Technology Stack

## Status
Accepted

## Context
ArchAI requires a modern, responsive, high-performance web interface capable of visualizing complex interactive architecture diagrams, rendering real-time streaming agent execution statuses, supporting rich JSON/Markdown/OpenAPI artifacts, and providing an enterprise developer workspace aesthetic.

## Decision
We chose **Next.js 14+ (App Router)** with **TypeScript**, **Tailwind CSS**, **Lucide Icons**, **TanStack Query**, and **React Flow**.

## Consequences
- **Pros**: Outstanding developer experience, rich ecosystem, instant client-side transitions, native SSE support, and modular component architecture.
- **Cons**: Requires Node.js build step in production.
