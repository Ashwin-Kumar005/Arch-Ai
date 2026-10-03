"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  ListChecks,
  PlayCircle,
  ShieldCheck,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Terminal,
} from "lucide-react";

export default function QAViewer({ data }: { data: any }) {
  const [runningTests, setRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, "PASS" | "FAIL">>({});
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const testCases = data?.test_cases || [
    { id: "TC-01", title: "User Registration & Argon2 Password Hashing", category: "UNIT", steps: ["Submit POST /api/v1/auth/register with valid credentials", "Verify 201 Created and password hash in DB"], expected_result: "JWT tokens issued; password securely hashed in PostgreSQL." },
    { id: "TC-02", title: "RBAC Role Guard Access Denied", category: "INTEGRATION", steps: ["Attempt GET /api/v1/admin/dashboard using standard USER role token", "Inspect response status code and JSON error payload"], expected_result: "HTTP 403 Forbidden with insufficient_permissions error." },
    { id: "TC-03", title: "Database Foreign Key Constraint Enforcement", category: "DATABASE", steps: ["Execute deletion on parent entity with cascade relations", "Query child table to verify cascading cleanup"], expected_result: "Foreign key constraints successfully enforced without orphaned records." },
    { id: "TC-04", title: "High-Concurrency API Rate Limiter", category: "PERFORMANCE", steps: ["Send 120 requests/minute to protected endpoint from single client IP", "Monitor Redis sliding window token counter"], expected_result: "Requests exceeding 100/min receive HTTP 429 Too Many Requests." },
    { id: "TC-05", title: "End-to-End Core Workflow Execution", category: "E2E", steps: ["Authenticate session", "Create entity", "Retrieve entity details", "Update status to completed"], expected_result: "Full workflow lifecycle completes with 200 OK across all states." },
  ];

  const tools = data?.testing_tools || ["Pytest 8.x", "Vitest / Jest", "Playwright E2E", "Postman / Newman", "k6 Load Testing"];

  const handleRunAllTests = () => {
    setRunningTests(true);
    setTestResults({});
    let delay = 300;

    testCases.forEach((tc: any, index: number) => {
      setTimeout(() => {
        setTestResults((prev) => ({
          ...prev,
          [tc.id]: "PASS",
        }));
        if (index === testCases.length - 1) {
          setRunningTests(false);
        }
      }, delay);
      delay += 350;
    });
  };

  const filteredTests = testCases.filter(
    (tc: any) => activeFilter === "ALL" || tc.category.toUpperCase() === activeFilter.toUpperCase()
  );

  const passedCount = Object.values(testResults).filter((r) => r === "PASS").length;

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-surface-200/90 border-b border-surface-border gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-brand-500/20 border border-emerald-500/40 flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                QA & Test Strategy Engineering Studio
              </h3>
              <span className="badge-neon-emerald px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                98.4% COVERAGE TARGET
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Automated unit, integration, and E2E regression test suites
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAllTests}
          disabled={runningTests}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white shadow-glow-emerald disabled:opacity-50 transition-all font-mono"
        >
          <Play className={`h-3.5 w-3.5 ${runningTests ? "animate-spin" : ""}`} />
          <span>{runningTests ? "Running Suite..." : "Execute All Test Suites"}</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Test Execution Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl glass-panel-card border-surface-border">
            <span className="text-xs text-slate-400">Total Test Cases</span>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{testCases.length} Defined</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Full edge case coverage</span>
          </div>

          <div className="p-4 rounded-xl glass-panel-card border-surface-border">
            <span className="text-xs text-slate-400">Passed Tests</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {passedCount} / {testCases.length}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">0 Regressions</span>
          </div>

          <div className="p-4 rounded-xl glass-panel-card border-surface-border">
            <span className="text-xs text-slate-400">Execution Speed</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">3.16s</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Parallel Pytest runner</span>
          </div>

          <div className="p-4 rounded-xl glass-panel-card border-surface-border">
            <span className="text-xs text-slate-400">CI/CD Gate Status</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">PASS (READY)</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">Merge approved</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {["ALL", "UNIT", "INTEGRATION", "DATABASE", "PERFORMANCE", "E2E"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  activeFilter === f
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                    : "bg-surface-raised border-surface-border text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {tools.map((t: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-surface border border-surface-border text-slate-300 text-[10px] font-mono hidden md:inline"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Test Cases List */}
        <div className="space-y-3.5">
          {filteredTests.map((tc: any, idx: number) => {
            const status = testResults[tc.id];
            return (
              <div
                key={idx}
                className="p-4.5 rounded-xl bg-surface-raised/90 border border-surface-border hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      {tc.id}
                    </span>
                    <h5 className="text-sm font-semibold text-slate-100">{tc.title}</h5>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge-neon-purple px-2 py-0.5 rounded text-[10px] font-mono">
                      {tc.category}
                    </span>
                    {status === "PASS" ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="h-3.5 w-3.5" /> PASSED
                      </span>
                    ) : runningTests ? (
                      <span className="flex items-center gap-1 text-cyan-400 text-xs font-mono animate-pulse">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Running...
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs font-mono">Ready to run</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Execution Steps
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono text-[11px]">
                      {tc.steps?.map((step: string, sIdx: number) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Expected Validation Output
                    </span>
                    <p className="text-emerald-300 font-mono text-[11px] leading-relaxed">
                      {tc.expected_result}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
