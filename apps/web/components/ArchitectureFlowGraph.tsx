"use client";

import React, { useState } from "react";
import {
  Layers,
  Database,
  Server,
  Globe,
  Radio,
  ExternalLink,
  Code2,
  Cpu,
  Zap,
  Activity,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  Maximize2,
} from "lucide-react";

export default function ArchitectureFlowGraph({ data }: { data: any }) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"diagram" | "mermaid" | "adr">("diagram");

  const nodes = data?.nodes || [
    { id: "client", label: "Next.js 14 Web / Mobile PWA", type: "frontend", latency: "< 50ms", protocol: "HTTPS / WSS", description: "React 18 Server Components with Tailwind CSS, TanStack Query & Web Worker state management." },
    { id: "gateway", label: "Edge API Gateway & Reverse Proxy", type: "gateway", latency: "< 5ms", protocol: "TLS 1.3", description: "Edge SSL termination, JWT validation, DDoS mitigation & Redis token bucket rate limiting." },
    { id: "backend", label: "FastAPI Core Microservices", type: "service", latency: "< 25ms", protocol: "ASGI / REST", description: "Async REST & OpenAPI controllers with Pydantic v2 schemas and role-based access control." },
    { id: "redis", label: "Redis 7 In-Memory Cache", type: "cache", latency: "< 2ms", protocol: "RESP", description: "Sub-millisecond session caching, distributed lock manager, and real-time Pub/Sub channels." },
    { id: "db", label: "PostgreSQL 16 3NF Relational Store", type: "database", latency: "< 10ms", protocol: "TCP / SQL", description: "ACID transactions with foreign key cascades, JSONB indexing, and connection pooling." },
    { id: "worker", label: "Async Task & Event Workers", type: "worker", latency: "< 100ms", protocol: "Celery / Queue", description: "Background queue processing, heavy aggregation jobs, and transactional webhook notifications." },
  ];

  const edges = data?.edges || [
    { source: "Client (Next.js)", target: "API Gateway", protocol: "HTTPS / JSON", latency: "35ms" },
    { source: "API Gateway", target: "FastAPI Backend", protocol: "ASGI / HTTP2", latency: "3ms" },
    { source: "FastAPI Backend", target: "PostgreSQL 16", protocol: "SQL / asyncpg", latency: "8ms" },
    { source: "FastAPI Backend", target: "Redis Cache", protocol: "RESP / TCP", latency: "1.5ms" },
    { source: "FastAPI Backend", target: "Task Worker", protocol: "AMQP / Queue", latency: "4ms" },
  ];

  const adrs = data?.architecture_decisions || [
    { adr_number: "ADR-001", title: "Adopt Next.js 14 App Router for Edge Rendering", status: "ACCEPTED", context: "Need high SEO score and fast TTFB.", decision: "Use React Server Components with Next.js 14.", consequences: "Significantly faster initial load, unified TypeScript type-safety." },
    { adr_number: "ADR-002", title: "FastAPI with Pydantic v2 for High-Throughput REST API", status: "ACCEPTED", context: "Require automatic OpenAPI 3.1 generation and high async performance.", decision: "FastAPI with async SQLAlchemy 2.0 ORM.", consequences: "Self-documenting APIs with sub-25ms response latency." },
    { adr_number: "ADR-003", title: "PostgreSQL 16 3NF Relational Database", status: "ACCEPTED", context: "Strict ACID transactional consistency is required.", decision: "PostgreSQL with normalized 3NF schema.", consequences: "Zero data duplication, rock-solid foreign key integrity." },
  ];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "frontend":
        return <Globe className="h-5 w-5 text-cyan-400" />;
      case "gateway":
        return <Radio className="h-5 w-5 text-brand-400" />;
      case "database":
        return <Database className="h-5 w-5 text-emerald-400" />;
      case "cache":
        return <Zap className="h-5 w-5 text-amber-400" />;
      case "worker":
        return <Cpu className="h-5 w-5 text-purple-400" />;
      default:
        return <Server className="h-5 w-5 text-brand-300" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-surface-200/90 border-b border-surface-border gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border border-brand-500/40 flex items-center justify-center">
            <Layers className="h-5 w-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                System Topology & Component Mesh
              </h3>
              <span className="badge-neon-purple px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                {data?.topology_pattern || "MODULAR MONOLITH"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive node topology, live communication protocols, and architectural decisions (ADRs)
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-xl bg-surface-raised p-1 border border-surface-border">
          <button
            onClick={() => setViewMode("diagram")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "diagram"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Interactive Topology
          </button>
          <button
            onClick={() => setViewMode("mermaid")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "mermaid"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            Mermaid Source
          </button>
          <button
            onClick={() => setViewMode("adr")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "adr"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            ADRs ({adrs.length})
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="flex-1 relative overflow-hidden flex">
        {viewMode === "diagram" && (
          <div className="flex-1 p-6 overflow-auto flex flex-col items-center bg-dot-pattern">
            {/* Live Topology Node Mesh */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full">
              {nodes.map((node: any) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? "border-brand-500 bg-brand-950/40 shadow-glow ring-1 ring-brand-500/50"
                        : "border-surface-border bg-surface-raised/90 hover:border-brand-500/40 hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center">
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100">{node.label}</h4>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {node.type}
                          </span>
                        </div>
                      </div>
                      <span className="badge-neon-emerald px-2 py-0.5 rounded text-[10px] font-mono">
                        {node.latency || "< 10ms"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>

                    <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Protocol: {node.protocol || "HTTPS"}</span>
                      <span className="text-brand-400 flex items-center gap-1 font-semibold group-hover:underline">
                        Inspect <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Communication Flow Edge Map */}
            <div className="mt-8 max-w-5xl w-full p-5 rounded-2xl bg-surface-raised/90 border border-surface-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Inter-Service Data Flow & Network Protocols
                </h4>
                <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Low Latency Mesh
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {edges.map((e: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface border border-surface-border flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-brand-300 font-bold">{e.source}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-cyan-300 font-bold">{e.target}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-raised border border-surface-border text-slate-400">
                      {e.protocol}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === "mermaid" && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="rounded-2xl border border-surface-border bg-slate-950 overflow-hidden shadow-card">
              <pre className="p-5 font-mono text-xs text-brand-300 overflow-x-auto leading-relaxed whitespace-pre">
                {data?.mermaid_diagram ||
                  `graph TD\n    Client[Next.js Client] -->|HTTPS| Gateway[API Gateway]\n    Gateway -->|ASGI| Backend[FastAPI Core]\n    Backend -->|SQL| Database[(PostgreSQL 16)]\n    Backend -->|Cache| Redis[(Redis 7)]`}
              </pre>
            </div>
          </div>
        )}

        {viewMode === "adr" && (
          <div className="flex-1 p-6 overflow-auto space-y-4">
            {adrs.map((adr: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface-raised border border-surface-border space-y-3 hover:border-brand-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100 font-mono">
                    <span className="text-brand-400 mr-2">{adr.adr_number}:</span> {adr.title}
                  </h4>
                  <span className="badge-neon-emerald px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    {adr.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-surface border border-surface-border">
                    <span className="text-slate-400 font-mono text-[10px] block font-bold mb-1">
                      CONTEXT
                    </span>
                    <p className="text-slate-300">{adr.context}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-brand-500/30">
                    <span className="text-brand-300 font-mono text-[10px] block font-bold mb-1">
                      DECISION
                    </span>
                    <p className="text-slate-200 font-medium">{adr.decision}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-surface-border">
                    <span className="text-cyan-400 font-mono text-[10px] block font-bold mb-1">
                      CONSEQUENCES
                    </span>
                    <p className="text-slate-300">{adr.consequences}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Node Inspector Drawer */}
        {selectedNode && viewMode === "diagram" && (
          <div className="w-88 border-l border-surface-border bg-surface-200/95 backdrop-blur-md p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-brand-400 font-mono">
                Component Inspector
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-slate-100 font-mono px-2 py-1 rounded bg-surface border border-surface-border"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center">
                {getNodeIcon(selectedNode.type)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedNode.label}</h3>
                <span className="text-xs font-mono text-cyan-400 uppercase">
                  {selectedNode.type} layer
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">
                  Description
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedNode.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">
                  Network Latency Benchmark
                </span>
                <p className="text-emerald-400 font-mono font-bold">{selectedNode.latency || "< 10ms"}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">
                  Communication Protocol
                </span>
                <p className="text-brand-300 font-mono font-bold">{selectedNode.protocol || "HTTPS / REST"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
