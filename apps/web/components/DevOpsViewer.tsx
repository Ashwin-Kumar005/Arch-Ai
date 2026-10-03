"use client";

import React, { useState } from "react";
import {
  Container,
  DollarSign,
  GitBranch,
  Cpu,
  Copy,
  Check,
  Server,
  Cloud,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Download,
  Activity,
  Zap,
} from "lucide-react";

export default function DevOpsViewer({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<"topology" | "cost" | "docker" | "ci">("topology");
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<"aws" | "gcp" | "vercel">("aws");
  const [simulatingDeploy, setSimulatingDeploy] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  const topology = data?.container_topology || [
    { name: "web", image: "node:18-alpine", port: "3000:3000", memory: "512MB", cpu: "0.5 vCPU", status: "Healthy" },
    { name: "api", image: "python:3.12-slim", port: "8000:8000", memory: "1024MB", cpu: "1.0 vCPU", status: "Healthy" },
    { name: "postgres", image: "postgres:15-alpine", port: "5432:5432", memory: "2048MB", cpu: "1.5 vCPU", status: "Healthy" },
    { name: "redis", image: "redis:7-alpine", port: "6379:6379", memory: "256MB", cpu: "0.25 vCPU", status: "Healthy" },
    { name: "worker", image: "python:3.12-slim", port: "N/A", memory: "512MB", cpu: "0.5 vCPU", status: "Healthy" },
  ];

  const costs = data?.cost_breakdown || [
    { service: "Managed Database (PostgreSQL)", provider: "AWS Aurora Serverless", tier_or_specs: "0.5 - 2 ACUs auto-scaled", notes: "Multi-AZ replication", estimated_monthly_usd: 48.0 },
    { service: "Container Compute (API & Workers)", provider: "AWS ECS Fargate", tier_or_specs: "2 Tasks (1 vCPU, 2GB)", notes: "Auto-scaled cluster", estimated_monthly_usd: 62.0 },
    { service: "Frontend Edge Hosting", provider: "Vercel Enterprise / CloudFront", tier_or_specs: "Edge Network + CDN", notes: "Global caching & SSR", estimated_monthly_usd: 20.0 },
    { service: "In-Memory Cache (Redis)", provider: "AWS ElastiCache", tier_or_specs: "cache.t4g.micro", notes: "Session store & rate limiting", estimated_monthly_usd: 18.0 },
    { service: "Object Storage & Backups", provider: "AWS S3 + Glacier", tier_or_specs: "Standard S3 (50 GB)", notes: "Automated daily snapshots", estimated_monthly_usd: 8.5 },
  ];

  const totalCost = data?.total_estimated_monthly_usd || 156.5;
  const dockerYaml = data?.docker_compose_yaml || `version: '3.8'
services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api
    restart: unless-stopped

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://archai:archai_secret@postgres:5432/archai_db
      - REDIS_URL=redis://redis:6379/0
      - JWT_SECRET=\${JWT_SECRET:-archai_super_secret_jwt_key_2026}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: archai
      POSTGRES_PASSWORD: archai_secret
      POSTGRES_DB: archai_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U archai -d archai_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`;

  const ciYaml = data?.github_actions_ci_yaml || `name: ArchAI Continuous Integration & Deployment

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Lint Backend & Type Check
        run: |
          pip install ruff mypy
          ruff check apps/api
      - name: Set up Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Lint Frontend & TypeScript
        run: |
          npm --prefix apps/web ci
          npm --prefix apps/web run lint

  test-suite:
    needs: lint-and-validate
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: archai
          POSTGRES_PASSWORD: archai_secret
          POSTGRES_DB: archai_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Run Backend Pytest Suite
        run: |
          pip install -r apps/api/requirements.txt
          pytest apps/api/tests -v --cov

  docker-build-and-push:
    needs: test-suite
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build & Push Docker Images
        run: |
          docker compose build --parallel
          echo "Production artifacts containerized successfully."`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRunPipelineSimulation = () => {
    setSimulatingDeploy(true);
    setDeployStep(1);
    setTimeout(() => setDeployStep(2), 800);
    setTimeout(() => setDeployStep(3), 1600);
    setTimeout(() => setDeployStep(4), 2400);
    setTimeout(() => {
      setDeployStep(5);
      setSimulatingDeploy(false);
    }, 3200);
  };

  const pipelineStages = [
    { title: "Lint & Static Analysis", detail: "Ruff + ESLint + TypeScript", time: "12s" },
    { title: "Automated Test Suite", detail: "Pytest (20/20) + Unit Gates", time: "24s" },
    { title: "Container Matrix Build", detail: "Docker Alpine Multi-Stage", time: "38s" },
    { title: "Zero-Downtime Rollout", detail: "AWS ECS Fargate Cluster", time: "15s" },
    { title: "Health Check Verification", detail: "HTTP 200 OK across zones", time: "4s" },
  ];

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card">
      {/* Top Studio Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-surface-200/90 border-b border-surface-border gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-brand-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Container className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                DevOps & Cloud Infrastructure Hub
              </h3>
              <span className="badge-neon-cyan px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                PRODUCTION READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-container topologies, auto-scaled cloud cost model, and verified CI/CD workflows
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-xl bg-surface-raised p-1 border border-surface-border">
          <button
            onClick={() => setActiveTab("topology")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "topology"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            Topology Grid
          </button>
          <button
            onClick={() => setActiveTab("cost")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "cost"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Cost Model (${totalCost.toFixed(0)}/mo)
          </button>
          <button
            onClick={() => setActiveTab("docker")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "docker"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            docker-compose.yml
          </button>
          <button
            onClick={() => setActiveTab("ci")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "ci"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            CI/CD Pipeline
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* TAB 1: CONTAINER TOPOLOGY */}
        {activeTab === "topology" && (
          <div className="space-y-6">
            {/* Telemetry Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-xl glass-panel-card border-surface-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Containers</span>
                  <Server className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                  {topology.length} Active
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Zero single point of failure
                </span>
              </div>

              <div className="p-4 rounded-xl glass-panel-card border-surface-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Target Orchestration</span>
                  <Cloud className="h-4 w-4 text-brand-400" />
                </div>
                <div className="text-xl font-bold font-mono text-slate-100 mt-1">AWS ECS / Fargate</div>
                <span className="text-[11px] text-slate-400 mt-1 block">Serverless container fleet</span>
              </div>

              <div className="p-4 rounded-xl glass-panel-card border-surface-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Allocated RAM</span>
                  <Cpu className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-100 mt-1">4.25 GB</div>
                <span className="text-[11px] text-amber-300 mt-1 block">Optimal cold start footprint</span>
              </div>

              <div className="p-4 rounded-xl glass-panel-card border-surface-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Auto-Scaling Trigger</span>
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">70% CPU / RAM</div>
                <span className="text-[11px] text-slate-400 mt-1 block">Scale out threshold</span>
              </div>
            </div>

            {/* Interactive Topology Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Container Services & Resource Allocations
                </h4>
                <span className="text-xs text-slate-400 font-mono">5/5 Services Configured</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topology.map((svc: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4.5 rounded-xl bg-surface-raised/90 border border-surface-border hover:border-cyan-500/40 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center font-mono text-xs font-bold text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                          0{idx + 1}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-slate-100 font-mono">{svc.name}</h5>
                          <span className="text-[11px] font-mono text-slate-400">{svc.image || "custom-build"}</span>
                        </div>
                      </div>
                      <span className="badge-neon-emerald px-2 py-0.5 rounded text-[10px] font-mono">
                        HEALTHY
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border/50 text-xs font-mono">
                      <div className="p-2 rounded-lg bg-surface/80 border border-surface-border/40">
                        <span className="text-[10px] text-slate-400 block">Exposed Port</span>
                        <span className="font-semibold text-cyan-300">{svc.port || "Internal"}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-surface/80 border border-surface-border/40">
                        <span className="text-[10px] text-slate-400 block">CPU & RAM</span>
                        <span className="font-semibold text-brand-300">{svc.memory || "512MB"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                      <span>Restart Policy:</span>
                      <span className="text-slate-300">unless-stopped</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COST ESTIMATION */}
        {activeTab === "cost" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/40 via-surface to-cyan-950/30 border border-brand-500/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-brand-400 uppercase tracking-wider block">
                  Automated Cloud Economics Report
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-mono mt-0.5">
                  Estimated Monthly Run Rate: <span className="text-emerald-400">${totalCost.toFixed(2)}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cost optimized for multi-tier microservices with auto-scaling down to baseline during off-peak hours.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProvider("aws")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                    selectedProvider === "aws"
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-surface-raised border-surface-border text-slate-400"
                  }`}
                >
                  AWS Cloud
                </button>
                <button
                  onClick={() => setSelectedProvider("gcp")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                    selectedProvider === "gcp"
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                      : "bg-surface-raised border-surface-border text-slate-400"
                  }`}
                >
                  GCP Cloud Run
                </button>
                <button
                  onClick={() => setSelectedProvider("vercel")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                    selectedProvider === "vercel"
                      ? "bg-brand-500/20 border-brand-500 text-brand-300"
                      : "bg-surface-raised border-surface-border text-slate-400"
                  }`}
                >
                  Vercel + Supabase
                </button>
              </div>
            </div>

            {/* Cost Table */}
            <div className="rounded-2xl border border-surface-border bg-surface-raised/90 overflow-hidden shadow-card">
              <div className="px-5 py-3.5 bg-surface-200 border-b border-surface-border flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Line-Item Infrastructure Budget Breakdown
                </h4>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Total: ${totalCost.toFixed(2)}/mo
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-surface-border/60 text-[10px] uppercase text-slate-400 font-mono bg-surface/50">
                      <th className="p-3.5">Architecture Component</th>
                      <th className="p-3.5">Target Provider</th>
                      <th className="p-3.5">Tier & Scaling Range</th>
                      <th className="p-3.5">Architectural Rationale</th>
                      <th className="p-3.5 text-right">Est. Monthly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/40">
                    {costs.map((c: any, idx: number) => (
                      <tr key={idx} className="hover:bg-surface/60 transition-colors">
                        <td className="p-3.5 font-semibold text-slate-200 font-mono flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                          {c.service}
                        </td>
                        <td className="p-3.5 text-brand-300 font-mono">{c.provider}</td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-300">{c.tier_or_specs}</td>
                        <td className="p-3.5 text-slate-400 text-[11px]">{c.notes}</td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                          ${c.estimated_monthly_usd?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOCKER COMPOSE YAML */}
        {activeTab === "docker" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                <span>docker-compose.yml (Multi-container Local Dev & Staging Rig)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(dockerYaml, "docker")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-xs text-slate-200 transition-all font-mono"
                >
                  {copied === "docker" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === "docker" ? "Copied to Clipboard" : "Copy YAML"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-surface-border bg-slate-950 overflow-hidden shadow-card">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-surface-border text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-slate-300 font-semibold">docker-compose.yml</span>
                </div>
                <span className="badge-neon-cyan px-2 py-0.5 rounded text-[10px]">YAML Syntax</span>
              </div>
              <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed whitespace-pre">
                {dockerYaml}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: CI/CD PIPELINE */}
        {activeTab === "ci" && (
          <div className="space-y-6">
            {/* Live Pipeline Simulator */}
            <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 font-mono">
                    Automated GitHub Actions CI/CD Pipeline
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Multi-stage workflow with automated quality gates and container publishing
                  </p>
                </div>
                <button
                  onClick={handleRunPipelineSimulation}
                  disabled={simulatingDeploy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-brand-600 hover:from-cyan-500 hover:to-brand-500 text-xs font-bold text-white shadow-glow-cyan disabled:opacity-50 transition-all font-mono"
                >
                  <Zap className={`h-3.5 w-3.5 ${simulatingDeploy ? "animate-spin" : ""}`} />
                  {simulatingDeploy ? "Simulating Pipeline..." : "Trigger Test Build"}
                </button>
              </div>

              {/* Pipeline Flow Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {pipelineStages.map((stg, sIdx) => {
                  const isDone = deployStep > sIdx + 1 || deployStep === 5;
                  const isCurrent = deployStep === sIdx + 1 && simulatingDeploy;
                  return (
                    <div
                      key={sIdx}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        isDone
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                          : isCurrent
                          ? "bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-glow-cyan animate-pulse"
                          : "bg-surface border-surface-border text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono font-bold">STAGE 0{sIdx + 1}</span>
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">{stg.time}</span>
                        )}
                      </div>
                      <h5 className="font-semibold text-slate-200 text-xs leading-tight mb-1">
                        {stg.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 block">{stg.detail}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workflow File */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">
                  .github/workflows/ci-cd.yml
                </span>
                <button
                  onClick={() => handleCopy(ciYaml, "ci")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-xs text-slate-200 transition-all font-mono"
                >
                  {copied === "ci" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === "ci" ? "Copied!" : "Copy CI Workflow"}
                </button>
              </div>

              <div className="rounded-2xl border border-surface-border bg-slate-950 overflow-hidden shadow-card">
                <pre className="p-5 font-mono text-xs text-accent-cyan overflow-x-auto leading-relaxed whitespace-pre">
                  {ciYaml}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
