# ADR 005: LLM Provider Abstraction

## Status
Accepted

## Context
ArchAI must support Google Gemini as the primary LLM provider, allow future expansions (OpenAI, Anthropic, Ollama), and feature a deterministic high-fidelity `MockProvider` for zero-token testing and live demonstrations.

## Decision
We implemented an abstract `LLMProvider` interface with runtime factory dispatching based on `LLM_PROVIDER` and `DEMO_MODE`.
