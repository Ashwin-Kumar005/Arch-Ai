/**
 * ArchAI Shared TypeScript Type Definitions
 */

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export type ProjectStatus =
  | 'DRAFT'
  | 'ANALYZING'
  | 'QUESTIONS_PENDING'
  | 'FINALIZING'
  | 'ORCHESTRATING'
  | 'COMPLETED'
  | 'FAILED';

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  industry: string;
  target_users: string;
  business_objective: string;
  scale_tier: string;
  tech_preferences: string;
  status: ProjectStatus;
  raw_idea?: string;
  created_at: string;
  updated_at: string;
  artifacts_count?: number;
}

export interface RequirementQuestion {
  id: string;
  question_text: string;
  category: string;
  options: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RequirementAnalysisData {
  project_summary: string;
  business_goals: string[];
  actors: string[];
  functional_requirements: string[];
  non_functional_requirements: string[];
  constraints: string[];
  assumptions: string[];
  dependencies: string[];
  risks: string[];
  open_questions: RequirementQuestion[];
}

export interface QuestionAnswerPayload {
  question_id: string;
  selected_option: string;
  custom_text?: string;
}

export type AgentKey =
  | 'requirement_analyst'
  | 'product_manager'
  | 'solution_architect'
  | 'database_architect'
  | 'backend_engineer'
  | 'frontend_planner'
  | 'devops_engineer'
  | 'security_expert'
  | 'qa_engineer'
  | 'technical_writer'
  | 'validator';

export type TaskStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING';

export interface AgentTask {
  id: string;
  agent_key: AgentKey;
  agent_name: string;
  status: TaskStatus;
  stage: number;
  duration_ms: number;
  token_usage: number;
  error_log?: string;
  started_at?: string;
  completed_at?: string;
}

export interface AgentRunState {
  id: string;
  project_id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  current_stage: number;
  total_tokens: number;
  execution_duration_ms: number;
  tasks: AgentTask[];
}

export type ArtifactType =
  | 'SRS'
  | 'ROADMAP'
  | 'ARCHITECTURE'
  | 'ERD'
  | 'SQL'
  | 'API_SPEC'
  | 'UI_FLOW'
  | 'SECURITY_REPORT'
  | 'TEST_PLAN'
  | 'DEPLOYMENT_PLAN'
  | 'TECHNICAL_DOC'
  | 'USER_MANUAL'
  | 'ADR'
  | 'CONSISTENCY_REPORT';

export interface Artifact {
  id: string;
  project_id: string;
  artifact_type: ArtifactType;
  title: string;
  version: number;
  content: string | Record<string, any>;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  type: string;
  description: string;
  x?: number;
  y?: number;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  protocol?: string;
}

export interface ArchitectureGraph {
  system_overview: string;
  topology_pattern: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  mermaid_diagram: string;
  scalability_strategy: string;
}

export interface ConsistencyIssue {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  source_domain: string;
  target_domain: string;
  issue_description: string;
  suggested_fix: string;
}

export interface ConsistencyReport {
  overall_valid: boolean;
  score_percentage: number;
  issues: ConsistencyIssue[];
  cross_domain_matrix: Record<string, string>;
}
