"use client";

import React, { useState } from "react";
import { Download, FileArchive, FileText, Code, Database, Globe, X, Check } from "lucide-react";

export default function ExportModal({
  projectId,
  isOpen,
  onClose,
}: {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async (format: string) => {
    setDownloading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("archai_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/v1/projects/${projectId}/export?format=${format}`, {
        method: "POST",
        headers,
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `archai_blueprint_${projectId.substring(0, 8)}.${format === "zip" ? "zip" : format === "markdown" ? "md" : "json"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to export blueprint");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-surface border border-surface-border p-6 shadow-glow relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-brand-950 border border-brand-500/30">
            <Download className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Export Software Blueprint</h3>
            <p className="text-xs text-slate-400">Download complete architecture deliverables</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleDownload("zip")}
            disabled={downloading}
            className="w-full p-4 rounded-xl border border-brand-500/40 bg-brand-950/40 hover:bg-brand-900/40 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileArchive className="h-5 w-5 text-brand-400" />
              <div>
                <span className="text-sm font-semibold text-slate-100 block">Complete ZIP Archive Bundle (Recommended)</span>
                <span className="text-xs text-slate-400">Includes SAD, SRS, schema.sql, openapi.json, and docker-compose.yml</span>
              </div>
            </div>
            <Download className="h-4 w-4 text-brand-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleDownload("markdown")}
            disabled={downloading}
            className="w-full p-3.5 rounded-xl border border-surface-border bg-surface-raised hover:bg-surface text-left flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-accent-cyan" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Unified Markdown Document (.md)</span>
                <span className="text-[11px] text-slate-400">Comprehensive blueprint document with tables & Mermaid</span>
              </div>
            </div>
            <Download className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleDownload("json")}
            disabled={downloading}
            className="w-full p-3.5 rounded-xl border border-surface-border bg-surface-raised hover:bg-surface text-left flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Code className="h-4 w-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Structured JSON Package (.json)</span>
                <span className="text-[11px] text-slate-400">Machine-readable typed Pydantic/Zod agent schemas</span>
              </div>
            </div>
            <Download className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-xs text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
