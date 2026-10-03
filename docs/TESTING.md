# ArchAI Quality Assurance & Testing Strategy

## 1. Testing Philosophy
ArchAI adheres to a comprehensive test pyramid ensuring reliability across every layer:
1. **Unit Tests**: Test individual agent prompt parsers, validation rules, RAG chunking algorithms, and security utilities in complete isolation.
2. **Integration Tests**: Test database transactions, repository operations, API route controllers, RAG vector retrieval, and mock LLM provider interactions.
3. **Multi-Agent Orchestration Tests**: Test the full 5-stage dependency execution graph, retry policies, failure recovery, and consistency validation.
4. **End-to-End (E2E) Tests**: Automated user journey simulation from initial idea prompt -> requirement analysis -> Q&A answering -> finalization -> orchestration -> artifact review & export.

## 2. Test Suites Organization
```
apps/api/tests/
├── unit/
│   ├── test_security.py         # Password hashing, JWT creation & verification
│   ├── test_llm_providers.py     # Gemini and Mock provider interfaces
│   ├── test_agents.py           # 10 Agent schema validations and prompt loaders
│   ├── test_rag_chunker.py      # Document chunking & metadata generation
│   └── test_validator.py        # Consistency validation engine checks
├── integration/
│   ├── test_auth_api.py         # Registration, login, demo access
│   ├── test_projects_api.py     # Project CRUD and access control
│   ├── test_requirements_api.py # Analysis, Q&A and finalization APIs
│   ├── test_orchestrator.py     # 5-stage agent runner execution
│   └── test_artifacts_api.py    # Artifact retrieval, versioning & export
└── e2e/
    └── test_full_pipeline.py    # Complete idea-to-blueprint pipeline
```

## 3. Running Test Suites
```bash
# Run backend unit and integration tests
pytest apps/api/tests -v

# Run frontend tests
cd apps/web && npm test

# Run full E2E pipeline verification
python scripts/verify_e2e.py
```
