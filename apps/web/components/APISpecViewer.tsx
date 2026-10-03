"use client";

import React, { useState } from "react";
import {
  Globe,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Play,
  Send,
  Code2,
  Search,
  Terminal,
  Sparkles,
  Download,
} from "lucide-react";

export default function APISpecViewer({ data }: { data: any }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"explorer" | "openapi">("explorer");

  // Simulated Test State
  const [testingEndpoint, setTestingEndpoint] = useState<number | null>(null);
  const [testResponse, setTestResponse] = useState<Record<number, any>>({});
  const [testLoading, setTestLoading] = useState(false);

  const endpoints = data?.endpoints || [];
  const openapi = data?.openapi_spec || {
    openapi: "3.1.0",
    info: { title: data?.api_title || "ArchAI Microservices API", version: "1.0.0" },
    paths: {},
  };

  const filteredEndpoints = endpoints.filter((ep: any) => {
    const matchesMethod = selectedMethod === "ALL" || ep.method.toUpperCase() === selectedMethod;
    const matchesSearch =
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/40";
      case "POST":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
      case "PUT":
      case "PATCH":
        return "bg-amber-500/15 text-amber-300 border-amber-500/40";
      case "DELETE":
        return "bg-rose-500/15 text-rose-300 border-rose-500/40";
      default:
        return "bg-surface-raised text-slate-300 border-surface-border";
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRunMockRequest = (idx: number, ep: any) => {
    setTestingEndpoint(idx);
    setTestLoading(true);
    setTimeout(() => {
      setTestResponse((prev) => ({
        ...prev,
        [idx]: {
          status: ep.method === "POST" ? 201 : 200,
          latency: `${Math.floor(Math.random() * 25) + 12}ms`,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "x-request-id": `req_${Math.random().toString(36).substring(2, 9)}`,
          },
          body: {
            status: "success",
            data: {
              id: `item_${Math.floor(Math.random() * 9000) + 1000}`,
              path_executed: ep.path,
              method: ep.method,
              authenticated: ep.auth_required,
              timestamp: new Date().toISOString(),
            },
          },
        },
      }));
      setTestLoading(false);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-surface-200/90 border-b border-surface-border gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-brand-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Globe className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                {data?.api_title || "REST API Specification & Playground"}
              </h3>
              <span className="badge-neon-cyan px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                OPENAPI 3.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Validated endpoints, JWT Bearer security schemes, and live HTTP simulation
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-xl bg-surface-raised p-1 border border-surface-border">
          <button
            onClick={() => setActiveView("explorer")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "explorer"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Endpoints Explorer ({endpoints.length})
          </button>
          <button
            onClick={() => setActiveView("openapi")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === "openapi"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            OpenAPI Schema JSON
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-2.5 bg-surface/50 border-b border-surface-border gap-3">
        <div className="flex items-center gap-2">
          {["ALL", "GET", "POST", "PUT", "DELETE"].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMethod(m)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                selectedMethod === m
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                  : "bg-surface-raised border-surface-border text-slate-400 hover:text-slate-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search route or tag..."
              className="w-full rounded-xl bg-surface-raised border border-surface-border pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <button
            onClick={() => handleCopy(JSON.stringify(openapi, null, 2), "openapi")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-xs text-slate-200 transition-all font-mono"
          >
            {copied === "openapi" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied === "openapi" ? "Copied" : "Export Spec"}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {activeView === "explorer" ? (
          filteredEndpoints.map((ep: any, idx: number) => {
            const isExpanded = expandedIndex === idx;
            const resp = testResponse[idx];

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? "border-cyan-500/50 bg-surface-raised/95 shadow-glow-cyan"
                    : "border-surface-border bg-surface-raised/75 hover:border-slate-600"
                }`}
              >
                {/* Endpoint Header Row */}
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase border ${getMethodBadge(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-100">{ep.path}</span>
                    <span className="text-xs text-slate-400 hidden md:inline">
                      — {ep.summary || "REST endpoint controller"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {ep.auth_required ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                        <Lock className="h-3 w-3" /> JWT Auth
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/30">
                        <Unlock className="h-3 w-3" /> Public
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Endpoint Body & Interactive Simulator */}
                {isExpanded && (
                  <div className="p-5 bg-surface-400 border-t border-surface-border space-y-5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-slate-300">{ep.summary}</p>
                      <button
                        onClick={() => handleRunMockRequest(idx, ep)}
                        disabled={testLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-brand-600 hover:from-cyan-500 hover:to-brand-500 text-xs font-bold text-white shadow-glow-cyan disabled:opacity-50 transition-all font-mono"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Live Test Request</span>
                      </button>
                    </div>

                    {/* Parameters Table */}
                    {ep.parameters && ep.parameters.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          Path & Query Parameters
                        </span>
                        <div className="rounded-xl border border-surface-border bg-surface-raised overflow-hidden">
                          <table className="w-full text-left text-xs font-mono">
                            <thead>
                              <tr className="border-b border-surface-border text-[10px] text-slate-500 bg-surface/50">
                                <th className="p-2.5">Name</th>
                                <th className="p-2.5">Location</th>
                                <th className="p-2.5">Data Type</th>
                                <th className="p-2.5">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-border/40 text-[11px]">
                              {ep.parameters.map((p: any, pIdx: number) => (
                                <tr key={pIdx}>
                                  <td className="p-2.5 text-cyan-300 font-bold">{p.name}</td>
                                  <td className="p-2.5 text-slate-400">{p.location}</td>
                                  <td className="p-2.5 text-brand-300">{p.type}</td>
                                  <td className="p-2.5 text-slate-300">{p.description || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Live Test Response Simulator Display */}
                    {resp && (
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live HTTP Response Output
                          </span>
                          <div className="flex items-center gap-3 font-mono text-[11px]">
                            <span className="text-emerald-400 font-bold">STATUS {resp.status} OK</span>
                            <span className="text-slate-400">{resp.latency}</span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-surface-border bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                          <pre>{JSON.stringify(resp.body, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-surface-border bg-slate-950 overflow-hidden shadow-card">
            <pre className="p-5 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed whitespace-pre">
              {JSON.stringify(openapi, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
