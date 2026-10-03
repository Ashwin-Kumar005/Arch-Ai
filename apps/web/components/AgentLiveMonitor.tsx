"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Cpu,
  Zap,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { ApiClient } from "@/lib/api";

const AGENT_LIST = [
  { key: "requirement_analyst", name: "Requirement Analyst", stage: 1, role: "Scope & Ambiguity Discovery" },
  { key: "product_manager", name: "Product Manager", stage: 2, role: "Roadmap & User Stories" },
  { key: "solution_architect", name: "Solution Architect", stage: 2, role: "System Topology & ADRs" },
  { key: "database_architect", name: "Database Architect", stage: 3, role: "ERD & SQL DDL" },
  { key: "backend_engineer", name: "Backend Engineer", stage: 3, role: "REST API & OpenAPI" },
  { key: "frontend_planner", name: "Frontend Planner", stage: 3, role: "UI Flow & Components" },
  { key: "devops_engineer", name: "DevOps Engineer", stage: 4, role: "Docker & CI/CD Pipeline" },
  { key: "security_expert", name: "Security Expert", stage: 4, role: "STRIDE & OWASP Matrix" },
  { key: "qa_engineer", name: "QA Engineer", stage: 4, role: "Test Pyramid & Cases" },
  { key: "validator", name: "Consistency Validator", stage: 5, role: "Cross-Domain Anomaly Check" },
  { key: "technical_writer", name: "Technical Writer", stage: 5, role: "SAD & Documentation" },
];

export default function AgentLiveMonitor({
  projectId,
  onRunComplete,
}: {
  projectId: string;
  onRunComplete?: () => void;
}) {
  const [agentStates, setAgentStates] = useState<Record<string, { status: string; tokens?: number; duration?: number }>>({});
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [runStatus, setRunStatus] = useState<string>("IDLE");
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Fetch initial agent runs
    ApiClient.getAgentRuns(projectId)
      .then((runs) => {
        if (runs && runs.length > 0) {
          const latest = runs[0];
          setRunStatus(latest.orchestrator_status);
          setCurrentStage(latest.current_stage || 1);
          setTotalTokens(latest.total_tokens || 0);

          const states: Record<string, any> = {};
          for (const t of latest.tasks || []) {
            states[t.agent_key] = {
              status: t.status,
              tokens: t.token_usage,
              duration: t.duration_ms,
            };
          }
          setAgentStates(states);
        }
      })
      .catch(() => {});

    // Subscribe to SSE events
    const streamUrl = ApiClient.getStreamUrl(projectId);
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: evType, data } = payload;

        if (evType === "STAGE_TRANSITION") {
          setCurrentStage(data.stage);
          setLogs((prev) => [`[Stage ${data.stage}] Transitioned to ${data.stage_name}`, ...prev.slice(0, 20)]);
        } else if (evType === "AGENT_STATUS") {
          setAgentStates((prev) => ({
            ...prev,
            [data.agent_key]: {
              status: data.status,
              tokens: data.tokens,
              duration: data.duration_ms,
            },
          }));
          if (data.status === "COMPLETED") {
            setTotalTokens((prev) => prev + (data.tokens || 0));
            setLogs((prev) => [`[Agent] ${data.agent_key} completed (${data.tokens || 0} tokens)`, ...prev.slice(0, 20)]);
          }
        } else if (evType === "RUN_STATUS") {
          setRunStatus(data.status);
        } else if (evType === "RUN_COMPLETED") {
          setRunStatus("COMPLETED");
          setTotalTokens(data.total_tokens || 0);
          setLogs((prev) => [`[Run] Multi-agent orchestration completed successfully!`, ...prev.slice(0, 20)]);
          if (onRunComplete) onRunComplete();
        }
      } catch (err) {
        // Ping or non-json message
      }
    };

    return () => {
      eventSource.close();
    };
  }, [projectId, onRunComplete]);

  const completedCount = Object.values(agentStates).filter((s) => s.status === "COMPLETED").length;
  const progressPercent = Math.round((completedCount / AGENT_LIST.length) * 100);

  return (
    <aside className="w-full lg:w-80 border-l border-surface-border bg-surface/50 backdrop-blur-md flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-surface-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-brand-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Agent Orchestrator
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
              runStatus === "RUNNING"
                ? "bg-brand-900/60 text-brand-300 border border-brand-500/30"
                : runStatus === "COMPLETED"
                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                : "bg-surface-raised text-slate-400"
            }`}
          >
            {runStatus}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Progress ({completedCount}/{AGENT_LIST.length})</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-accent-cyan transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
            <span>Tokens: {totalTokens.toLocaleString()}</span>
            <span>Stage: {currentStage}/5</span>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {AGENT_LIST.map((agent) => {
          const state = agentStates[agent.key] || { status: "QUEUED" };
          const isRunning = state.status === "RUNNING";
          const isDone = state.status === "COMPLETED";
          const isFailed = state.status === "FAILED";

          return (
            <div
              key={agent.key}
              className={`p-2.5 rounded-lg border transition-all ${
                isRunning
                  ? "bg-brand-950/40 border-brand-500/40 shadow-glow"
                  : isDone
                  ? "bg-surface-raised/60 border-surface-border"
                  : "bg-surface/30 border-surface-border/50 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Loader2 className="h-3.5 w-3.5 text-brand-400 animate-spin" />
                  ) : isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ) : isFailed ? (
                    <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  <span className="text-xs font-medium text-slate-200">{agent.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">S{agent.stage}</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-5.5 mt-0.5 truncate">{agent.role}</p>

              {isDone && state.tokens && (
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono pl-5.5 mt-1">
                  <span>{state.tokens} tokens</span>
                  <span>{state.duration ? `${state.duration}ms` : ""}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Activity Logs Console */}
      <div className="p-3 border-t border-surface-border bg-surface-raised/40">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-1.5">
          <Terminal className="h-3 w-3 text-accent-cyan" />
          <span>Execution Telemetry</span>
        </div>
        <div className="h-24 overflow-y-auto rounded bg-background/80 p-2 font-mono text-[10px] text-slate-400 space-y-1">
          {logs.length === 0 ? (
            <span className="text-slate-600">Waiting for agent execution events...</span>
          ) : (
            logs.map((l, idx) => (
              <div key={idx} className="truncate">
                {l}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
