"""
ArchAI Agent Contract Schemas
Typed Pydantic models for all 10 domain agents and validation engine.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# AGENT 1: Requirement Analyst Contracts
# ---------------------------------------------------------------------------

class RequirementQuestion(BaseModel):
    id: str = Field(description="Unique question identifier, e.g. q1")
    question_text: str = Field(description="Actionable, unambiguous question prompt")
    category: str = Field(description="Domain area, e.g. Payments, Authentication, Scale")
    options: List[str] = Field(description="Curated list of standard selectable options")
    priority: str = Field(default="MEDIUM", description="Priority level: HIGH, MEDIUM, LOW")


class RequirementAnalysisOutput(BaseModel):
    project_summary: str
    business_goals: List[str]
    actors: List[str]
    functional_requirements: List[str]
    non_functional_requirements: List[str]
    constraints: List[str]
    assumptions: List[str]
    dependencies: List[str]
    risks: List[str]
    open_questions: List[RequirementQuestion]


class FinalizedSRSOutput(BaseModel):
    project_title: str
    executive_summary: str
    scope_definition: str
    functional_requirements: List[Dict[str, Any]]
    non_functional_requirements: List[Dict[str, Any]]
    user_stories: List[Dict[str, Any]]
    assumptions: List[str]
    constraints: List[str]
    risks_and_mitigations: List[Dict[str, str]]
    success_metrics: List[str]


# ---------------------------------------------------------------------------
# AGENT 2: Product Manager Contracts
# ---------------------------------------------------------------------------

class UserStoryItem(BaseModel):
    id: str
    as_a: str
    i_want: str
    so_that: str
    acceptance_criteria: List[str]
    priority: str = "MUST_HAVE"  # MUST_HAVE, SHOULD_HAVE, COULD_HAVE


class SprintItem(BaseModel):
    sprint_number: int
    focus_area: str
    duration_weeks: int = 2
    deliverables: List[str]


class ProductRoadmapOutput(BaseModel):
    mvp_definition: str
    mvp_features: List[str]
    post_mvp_features: List[str]
    user_stories: List[UserStoryItem]
    sprint_plan: List[SprintItem]
    key_performance_indicators: List[str]


# ---------------------------------------------------------------------------
# AGENT 3: Solution Architect Contracts
# ---------------------------------------------------------------------------

class DiagramNode(BaseModel):
    id: str
    label: str
    type: str  # frontend, gateway, service, database, cache, external, queue
    description: str
    x: int = 0
    y: int = 0


class DiagramEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    protocol: Optional[str] = "HTTPS"  # HTTPS, WSS, TCP, gRPC, DB


class ArchitectureDecision(BaseModel):
    adr_number: str
    title: str
    context: str
    decision: str
    consequences: str
    status: str = "ACCEPTED"


class SolutionArchitectureOutput(BaseModel):
    system_overview: str
    topology_pattern: str  # Microservices, Modular Monolith, Serverless, Event-Driven
    nodes: List[DiagramNode]
    edges: List[DiagramEdge]
    mermaid_diagram: str
    scalability_strategy: str
    caching_and_event_strategy: str
    architecture_decisions: List[ArchitectureDecision]


# ---------------------------------------------------------------------------
# AGENT 4: Database Architect Contracts
# ---------------------------------------------------------------------------

class ColumnSchema(BaseModel):
    name: str
    type: str
    is_primary_key: bool = False
    is_nullable: bool = True
    is_unique: bool = False
    default_value: Optional[str] = None
    description: Optional[str] = None


class TableSchema(BaseModel):
    name: str
    description: str
    columns: List[ColumnSchema]
    indexes: List[str] = []


class RelationSchema(BaseModel):
    from_table: str
    from_column: str
    to_table: str
    to_column: str
    relation_type: str  # 1:1, 1:N, N:M
    cascade_delete: bool = True


class DatabaseArchitectureOutput(BaseModel):
    dialect: str = "PostgreSQL"
    database_overview: str
    tables: List[TableSchema]
    relations: List[RelationSchema]
    indexing_strategy: str
    ddl_script: str
    vector_storage_design: Optional[str] = None


# ---------------------------------------------------------------------------
# AGENT 5: Backend Engineer Contracts
# ---------------------------------------------------------------------------

class EndpointParam(BaseModel):
    name: str
    location: str  # path, query, header, body
    type: str
    required: bool = True
    description: Optional[str] = None


class EndpointDefinition(BaseModel):
    path: str
    method: str  # GET, POST, PUT, PATCH, DELETE
    summary: str
    tags: List[str]
    parameters: List[EndpointParam] = []
    request_body_schema: Optional[Dict[str, Any]] = None
    responses: Dict[str, str]  # "200": "Success payload description"
    auth_required: bool = True
    required_role: Optional[str] = "user"


class BackendArchitectureOutput(BaseModel):
    framework: str = "FastAPI"
    api_title: str
    version: str = "1.0.0"
    endpoints: List[EndpointDefinition]
    service_layer_structure: List[str]
    authentication_strategy: str
    openapi_spec: Dict[str, Any]


# ---------------------------------------------------------------------------
# AGENT 6: Frontend Planner Contracts
# ---------------------------------------------------------------------------

class ScreenView(BaseModel):
    screen_id: str
    name: str
    route_path: str
    description: str
    components: List[str]
    api_endpoints_used: List[str]


class ComponentNode(BaseModel):
    name: str
    category: str  # layout, feature, shared, ui
    description: str
    props: List[str] = []


class FrontendArchitectureOutput(BaseModel):
    framework: str = "Next.js (App Router)"
    state_management: str
    ui_library: str = "Tailwind CSS + shadcn/ui"
    screens: List[ScreenView]
    component_hierarchy: List[ComponentNode]
    responsive_design_rules: List[str]


# ---------------------------------------------------------------------------
# AGENT 7: DevOps Engineer Contracts
# ---------------------------------------------------------------------------

class CostItem(BaseModel):
    service: str
    provider: str
    tier_or_specs: str
    estimated_monthly_usd: float
    notes: str


class DevOpsArchitectureOutput(BaseModel):
    container_topology: List[str]
    docker_compose_yaml: str
    github_actions_ci_yaml: str
    environment_variables_spec: List[Dict[str, str]]
    cost_breakdown: List[CostItem]
    total_estimated_monthly_usd: float
    monitoring_and_observability: str


# ---------------------------------------------------------------------------
# AGENT 8: Security Expert Contracts
# ---------------------------------------------------------------------------

class ThreatItem(BaseModel):
    category: str  # Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege
    threat_description: str
    impact_level: str  # HIGH, MEDIUM, LOW
    mitigation_strategy: str


class OwaspCheck(BaseModel):
    vulnerability: str
    relevance: str
    preventative_measure: str


class SecurityArchitectureOutput(BaseModel):
    threat_model: List[ThreatItem]
    owasp_top_10_mitigations: List[OwaspCheck]
    rbac_permission_matrix: Dict[str, List[str]]
    encryption_standards: Dict[str, str]
    secrets_management: str
    security_hardening_checklist: List[str]


# ---------------------------------------------------------------------------
# AGENT 9: QA Engineer Contracts
# ---------------------------------------------------------------------------

class TestCase(BaseModel):
    id: str
    category: str  # UNIT, INTEGRATION, E2E, SECURITY, LOAD
    feature: str
    title: str
    preconditions: str
    steps: List[str]
    expected_result: str
    priority: str = "HIGH"


class QAArchitectureOutput(BaseModel):
    test_strategy_overview: str
    testing_tools: List[str]
    test_cases: List[TestCase]
    edge_cases_and_recovery: List[Dict[str, str]]
    load_and_performance_criteria: str
    sample_automated_test_code: str


# ---------------------------------------------------------------------------
# VALIDATION ENGINE CONTRACT
# ---------------------------------------------------------------------------

class ConsistencyIssue(BaseModel):
    severity: str  # ERROR, WARNING, INFO
    source_domain: str
    target_domain: str
    issue_description: str
    suggested_fix: str


class ConsistencyReportOutput(BaseModel):
    overall_valid: bool
    score_percentage: int
    issues: List[ConsistencyIssue]
    cross_domain_matrix: Dict[str, str]


# ---------------------------------------------------------------------------
# AGENT 10: Technical Writer Contracts
# ---------------------------------------------------------------------------

class TechnicalDocumentationOutput(BaseModel):
    document_title: str
    version: str = "1.0.0"
    executive_summary: str
    system_architecture_document: str  # Full markdown
    software_requirements_specification: str  # Full markdown
    developer_onboarding_guide: str  # Full markdown
    operations_manual: str  # Full markdown
