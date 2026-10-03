"use client";

import React, { useState, useMemo } from "react";
import {
  Folder,
  FileCode,
  FileText,
  Database,
  Container,
  Download,
  Copy,
  Check,
  Search,
  Terminal,
  Play,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Code2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface CodebaseStudioProps {
  codebaseData: any;
  projectId: string;
  onExportZip?: () => void;
}

export default function CodebaseStudio({
  codebaseData,
  projectId,
  onExportZip,
}: CodebaseStudioProps) {
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "trace">("code");
  const [selectedFilePath, setSelectedFilePath] = useState<string>("backend/app/main.py");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [simulatedEndpoint, setSimulatedEndpoint] = useState("/api/v1/resources");
  const [simulatedResponse, setSimulatedResponse] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const files = useMemo(() => {
    return codebaseData?.files || [];
  }, [codebaseData]);

  // Selected active file object
  const activeFile = useMemo(() => {
    return files.find((f: any) => f.path === selectedFilePath) || files[0] || null;
  }, [files, selectedFilePath]);

  // Filtered files for search
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase();
    return files.filter(
      (f: any) =>
        f.path.toLowerCase().includes(q) ||
        f.language.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [files, searchQuery]);

  // Group files by category folder
  const groupedFiles = useMemo(() => {
    const groups: Record<string, any[]> = {
      backend: [],
      frontend: [],
      database: [],
      devops: [],
      testing: [],
      docs: [],
    };
    filteredFiles.forEach((f: any) => {
      const cat = f.category || "backend";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f);
    });
    return groups;
  }, [filteredFiles]);

  const handleCopyCode = () => {
    if (!activeFile?.content) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile.path.split("/").pop() || "file.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSimulateApi = () => {
    setSimulating(true);
    setTimeout(() => {
      if (simulatedEndpoint === "/health") {
        setSimulatedResponse({
          status: "HEALTHY",
          service: codebaseData?.project_name || "ArchAI Service",
          version: "1.0.0",
          database: "CONNECTED",
          latency_ms: 2.4,
        });
      } else if (simulatedEndpoint === "/api/v1/resources") {
        setSimulatedResponse([
          {
            id: "res-39182-live",
            title: `${codebaseData?.project_name || "Enterprise"} Primary Entity`,
            status: "ACTIVE",
            created_at: new Date().toISOString(),
            cluster: "us-east-1a",
          },
          {
            id: "res-39183-live",
            title: "Secondary Shard Node",
            status: "ACTIVE",
            created_at: new Date().toISOString(),
            cluster: "us-east-1b",
          },
        ]);
      } else {
        setSimulatedResponse({
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.archai_token_demo_signature",
          token_type: "Bearer",
          expires_in: 604800,
          user: {
            id: "usr_991823",
            role: "lead_architect",
          },
        });
      }
      setSimulating(false);
    }, 350);
  };

  const lineCount = useMemo(() => {
    if (!activeFile?.content) return 1;
    return activeFile.content.split("\n").length;
  }, [activeFile]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-surface to-brand-950/40 border border-brand-500/30 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-900/80 border border-brand-500/40 text-accent-cyan text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-glow">
              <Sparkles className="h-3 w-3" />
              FULL-STACK SOFTWARE IMPLEMENTATION
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {codebaseData?.total_files || files.length} Scaffolded Files • {codebaseData?.total_lines_of_code || 850}+ Lines of Code
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-slate-100 mt-2">
            Production Software Repository & Implementation Studio
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Autonomous multi-agent synthesis has translated your architecture blueprints into runnable, typed source code for backend APIs, database models, frontend components, and container orchestration.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportZip}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-xs font-semibold text-white shadow-glow transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Full Repository (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === "code"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface text-slate-400 hover:text-slate-200 hover:bg-surface-raised"
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>Codebase Explorer & IDE</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === "preview"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface text-slate-400 hover:text-slate-200 hover:bg-surface-raised"
          }`}
        >
          <Terminal className="h-4 w-4 text-accent-cyan" />
          <span>Run Simulator & Live API Tester</span>
        </button>

        <button
          onClick={() => setActiveTab("trace")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
            activeTab === "trace"
              ? "bg-brand-600 text-white shadow-glow"
              : "bg-surface text-slate-400 hover:text-slate-200 hover:bg-surface-raised"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Architecture-to-Code Traceability</span>
        </button>
      </div>

      {/* Main Studio View */}
      {activeTab === "code" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px] rounded-2xl overflow-hidden border border-surface-border bg-[#030509]">
          {/* Left Column: Interactive File Tree */}
          <div className="lg:col-span-4 flex flex-col border-r border-surface-border/60 bg-surface/50 select-none">
            {/* Search Bar */}
            <div className="p-3 border-b border-surface-border/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter codebase files..."
                  className="w-full bg-surface-raised border border-surface-border/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            {/* Tree List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3 font-mono text-xs">
              {Object.entries(groupedFiles).map(([cat, groupFiles]) => {
                if (groupFiles.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-500 px-2 py-1">
                      <Folder className="h-3.5 w-3.5 text-brand-400" />
                      <span>{cat}</span>
                      <span className="text-[9px] text-slate-600 ml-auto">({groupFiles.length})</span>
                    </div>

                    <div className="space-y-0.5 pl-2">
                      {groupFiles.map((file) => {
                        const isSelected = file.path === selectedFilePath;
                        const filename = file.path.split("/").pop();
                        return (
                          <button
                            key={file.path}
                            onClick={() => setSelectedFilePath(file.path)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                              isSelected
                                ? "bg-brand-950/90 text-brand-200 border border-brand-500/40 shadow-sm"
                                : "text-slate-400 hover:text-slate-200 hover:bg-surface-raised/60"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileCode
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  isSelected ? "text-accent-cyan" : "text-slate-500"
                                }`}
                              />
                              <span className="truncate text-[11px] font-medium">{filename}</span>
                            </div>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-surface-border/40 text-slate-500 shrink-0">
                              {file.language}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tech Stack Summary Footer */}
            <div className="p-3 border-t border-surface-border/60 bg-surface/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Stack: FastAPI + Next.js</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready to Run
              </span>
            </div>
          </div>

          {/* Right Column: Code Editor & Viewer */}
          <div className="lg:col-span-8 flex flex-col bg-[#05070c]">
            {/* Editor Action Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border/60 bg-surface/70 text-xs font-mono">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-slate-400 truncate">{activeFile?.path}</span>
                <span className="px-2 py-0.5 rounded bg-brand-950 border border-brand-500/30 text-[10px] text-brand-300 uppercase">
                  {activeFile?.language}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-[11px] text-slate-300 transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={handleDownloadSingleFile}
                  className="p-1.5 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-slate-300 hover:text-white transition-colors"
                  title="Download this file"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Description Sub-banner */}
            {activeFile?.description && (
              <div className="px-4 py-1.5 bg-brand-950/30 border-b border-brand-500/10 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span className="text-brand-400 font-bold">•</span>
                <span>{activeFile.description}</span>
              </div>
            )}

            {/* Code Body with Line Numbers */}
            <div className="flex-1 flex overflow-hidden">
              <div className="w-12 py-4 select-none bg-[#030509] border-r border-surface-border/30 text-right pr-3 font-mono text-xs text-slate-600">
                {Array.from({ length: Math.min(lineCount, 5000) }).map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              <pre className="flex-1 p-4 font-mono text-xs text-slate-200 leading-6 overflow-auto whitespace-pre selection:bg-brand-900/80">
                <code>{activeFile?.content}</code>
              </pre>
            </div>

            {/* Status Footer */}
            <div className="px-4 py-1.5 border-t border-surface-border/40 bg-[#030509] text-[10px] font-mono text-slate-500 flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <span>{lineCount} lines</span>
                <span>Category: {activeFile?.category}</span>
              </div>
              <div>
                <span className="text-accent-cyan">UTF-8 • Generated by ArchAI Engine</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulator View */}
      {activeTab === "preview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulated Terminal */}
          <div className="p-6 rounded-2xl bg-[#030509] border border-surface-border space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-surface-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-slate-400 ml-2">ArchAI Local Execution Simulator</span>
              </div>
              <span className="text-[10px] text-emerald-400">STATUS: READY</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p className="text-slate-500"># 1. Starting Database & Redis Containers...</p>
              <p className="text-emerald-400">[+] Running 2/2: Container postgres [Started], Container redis [Started]</p>
              <p className="text-slate-500 mt-2"># 2. Launching FastAPI Backend Engine...</p>
              <p className="text-slate-300">INFO:     Started server process [8841]</p>
              <p className="text-slate-300">INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)</p>
              <p className="text-slate-500 mt-2"># 3. Next.js 14 Frontend Web Client...</p>
              <p className="text-cyan-400">▲ Next.js 14.2.5 - Local: http://localhost:3000</p>
              <p className="text-emerald-400">✓ Ready in 1.8s</p>
            </div>

            <div className="pt-4 border-t border-surface-border/40">
              <h4 className="text-xs font-bold text-slate-300 mb-2">CLI Execution Command:</h4>
              <div className="p-3 rounded-xl bg-surface-raised border border-surface-border text-xs text-brand-300">
                <code>docker compose up --build -d</code>
              </div>
            </div>
          </div>

          {/* Interactive REST Endpoint Tester */}
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <h3 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent-cyan" />
              Simulated Endpoint Request Tester
            </h3>
            <p className="text-xs text-slate-400">
              Test synthetic API responses against the architected REST endpoints:
            </p>

            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={simulatedEndpoint}
                  onChange={(e) => setSimulatedEndpoint(e.target.value)}
                  className="flex-1 bg-surface-raised border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="/health">GET /health</option>
                  <option value="/api/v1/resources">GET /api/v1/resources</option>
                  <option value="/api/v1/auth/login">POST /api/v1/auth/login</option>
                </select>

                <button
                  onClick={handleSimulateApi}
                  disabled={simulating}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white rounded-xl shadow-glow transition-all flex items-center gap-2"
                >
                  {simulating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  <span>Send Request</span>
                </button>
              </div>

              {simulatedResponse && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono text-slate-400">HTTP 200 OK Response Payload:</span>
                  <pre className="p-4 rounded-xl bg-[#030509] border border-surface-border/60 text-xs font-mono text-emerald-300 overflow-x-auto">
                    {JSON.stringify(simulatedResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Traceability View */}
      {activeTab === "trace" && (
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-6">
          <div>
            <h3 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-400" />
              Autonomous Agent-to-Code Generation Traceability
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Trace how domain decisions flow from requirements to concrete software code files:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-brand-300">
                <Database className="h-4 w-4 text-amber-400" />
                <span>Database Architect</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Synthesized 3NF relational schemas, indexes, and foreign constraints into:
              </p>
              <ul className="text-xs font-mono text-slate-200 space-y-1">
                <li className="text-accent-cyan">• database/schema.sql</li>
                <li className="text-accent-cyan">• backend/app/models/entities.py</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-brand-300">
                <Cpu className="h-4 w-4 text-brand-400" />
                <span>Backend & API Engineers</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Designed REST controllers, JWT middleware, and Pydantic schemas into:
              </p>
              <ul className="text-xs font-mono text-slate-200 space-y-1">
                <li className="text-accent-cyan">• backend/app/main.py</li>
                <li className="text-accent-cyan">• backend/app/api/v1/controllers.py</li>
                <li className="text-accent-cyan">• backend/app/core/security.py</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-brand-300">
                <Container className="h-4 w-4 text-emerald-400" />
                <span>DevOps & QA Engineers</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Engineered container topologies, test suites, and CI workflows into:
              </p>
              <ul className="text-xs font-mono text-slate-200 space-y-1">
                <li className="text-accent-cyan">• docker-compose.yml</li>
                <li className="text-accent-cyan">• backend/tests/test_api_integration.py</li>
                <li className="text-accent-cyan">• README.md</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
