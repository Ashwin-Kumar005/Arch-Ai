"use client";

import React, { useState } from "react";
import {
  Database,
  Table,
  Key,
  Copy,
  Check,
  FileCode,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  Download,
  Filter,
} from "lucide-react";

export default function ERDViewer({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"tables" | "relations" | "sql" | "query">("tables");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const tables = data?.tables || [];
  const relations = data?.relations || [];
  const ddlScript = data?.ddl_script || "-- SQL DDL script not generated yet";

  const filteredTables = tables.filter((t: any) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(ddlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([ddlScript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "archai-schema.sql";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-surface-200/90 border-b border-surface-border gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-brand-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Database className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                Database Studio & 3NF ERD Visualizer
              </h3>
              <span className="badge-neon-emerald px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                3NF NORMALIZED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Relational schemas, primary/foreign key mappings, and indexed PostgreSQL DDL
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-xl bg-surface-raised p-1 border border-surface-border">
          <button
            onClick={() => setActiveTab("tables")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "tables"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            Entity Tables ({tables.length})
          </button>
          <button
            onClick={() => setActiveTab("relations")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "relations"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Foreign Relations ({relations.length})
          </button>
          <button
            onClick={() => setActiveTab("sql")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "sql"
                ? "bg-brand-600 text-white shadow-glow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            PostgreSQL DDL
          </button>
        </div>
      </div>

      {/* Action Sub-bar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-surface/50 border-b border-surface-border">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter entities & columns..."
            className="w-full rounded-xl bg-surface-raised border border-surface-border pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "sql" && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-xs text-slate-200 transition-all font-mono"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy SQL"}
              </button>
              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold transition-all font-mono shadow-glow-emerald"
              >
                <Download className="h-3.5 w-3.5" />
                Export schema.sql
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* VIEW 1: ENTITY TABLES */}
        {activeTab === "tables" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTables.map((tbl: any, idx: number) => {
              const isSelected = selectedTable === tbl.name;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTable(isSelected ? null : tbl.name)}
                  className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                    isSelected
                      ? "border-emerald-500 bg-surface-raised shadow-glow-emerald ring-1 ring-emerald-500/50"
                      : "border-surface-border bg-surface-raised/90 hover:border-slate-600"
                  }`}
                >
                  <div className="px-4 py-3 bg-surface-200 border-b border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <Table className="h-4 w-4 text-emerald-400" />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-100">
                        {tbl.name}
                      </span>
                    </div>
                    <span className="badge-neon-emerald px-2 py-0.5 rounded text-[10px] font-mono">
                      {tbl.columns?.length || 0} columns
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {tbl.description || "Database entity model with automated timestamps and foreign relations."}
                    </p>

                    <div className="rounded-xl border border-surface-border/60 overflow-hidden bg-slate-950/60">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-surface-border/60 text-[10px] uppercase text-slate-400 font-mono bg-surface/80">
                            <th className="p-2 pl-3">Field</th>
                            <th className="p-2">Type</th>
                            <th className="p-2 pr-3 text-right">Key</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border/30 font-mono text-[11px]">
                          {tbl.columns?.map((col: any, cIdx: number) => (
                            <tr key={cIdx} className="hover:bg-surface/50">
                              <td className="p-2 pl-3 font-semibold text-slate-200">{col.name}</td>
                              <td className="p-2 text-brand-300">{col.type}</td>
                              <td className="p-2 pr-3 text-right">
                                {col.is_primary_key ? (
                                  <span className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                                    <Key className="h-2.5 w-2.5" /> PK
                                  </span>
                                ) : col.is_foreign_key ? (
                                  <span className="inline-flex items-center gap-1 text-cyan-400 text-[10px] font-bold bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/30">
                                    FK
                                  </span>
                                ) : !col.is_nullable ? (
                                  <span className="text-slate-500 text-[10px]">NN</span>
                                ) : (
                                  <span className="text-slate-600 text-[10px]">NULL</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: RELATIONS */}
        {activeTab === "relations" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relations.map((rel: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-raised border border-surface-border flex items-center justify-between hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-300">
                      {rel.source_table}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-mono text-slate-400">{rel.type || "1:N"}</span>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/30 font-mono text-xs font-bold text-brand-300">
                      {rel.target_table}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    ON DELETE CASCADE
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: POSTGRESQL DDL */}
        {activeTab === "sql" && (
          <div className="rounded-2xl border border-surface-border bg-slate-950 overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-surface-border text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-slate-300 font-semibold">database/schema.sql (PostgreSQL 3NF DDL)</span>
              </div>
              <span className="badge-neon-emerald px-2 py-0.5 rounded text-[10px]">SQL SYNTAX</span>
            </div>
            <pre className="p-5 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed whitespace-pre">
              {ddlScript}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
