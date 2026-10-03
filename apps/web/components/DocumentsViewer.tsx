"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  Search,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Layers,
  Database,
  Loader2,
  Sparkles,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ApiClient } from "@/lib/api";

interface DocumentsViewerProps {
  projectId: string;
  onOpenDocumentTab?: (doc: any) => void;
}

export default function DocumentsViewer({
  projectId,
  onOpenDocumentTab,
}: DocumentsViewerProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchDocuments = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const docs = await ApiClient.getDocuments(projectId);
      setDocuments(docs || []);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      await ApiClient.uploadDocument(projectId, file);
      await fetchDocuments();
      e.target.value = "";
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await ApiClient.searchDocuments(projectId, searchQuery);
      setSearchResults(results || []);
    } catch (err) {
      console.error("RAG search failed", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-surface-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-400" />
              RAG Knowledge Base & Context Documents
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300">
              Isolated Context Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ingested PRDs, RFCs, and API docs are isolated inside <code className="text-accent-cyan font-mono">&lt;UNTRUSTED_CONTEXT&gt;</code> shielding against prompt injections.
          </p>
        </div>

        {/* Upload Button */}
        <label className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-glow cursor-pointer transition-all">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <UploadCloud className="h-4 w-4 text-white" />
          )}
          <span>{uploading ? "Ingesting & Chunking..." : "Upload Document (PDF/DOCX/MD)"}</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md,.json"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/50 flex items-center gap-2.5 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Semantic Search Sandbox */}
      <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-accent-cyan" />
          Semantic Vector Search Tester
        </h4>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts across ingested documents (e.g., 'authentication', 'payment gateway', 'SLA')..."
              className="w-full bg-surface-raised border border-surface-border focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-surface-raised hover:bg-surface border border-surface-border text-xs font-semibold text-slate-200 rounded-xl transition-colors flex items-center gap-2"
          >
            {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />}
            <span>Search</span>
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <span className="text-[11px] font-mono text-slate-400">
              Matched {searchResults.length} Context Chunks
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-raised border border-surface-border space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-brand-300 font-semibold truncate max-w-[200px]">
                      {res.filename}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-brand-950 border border-brand-500/20 text-accent-cyan text-[10px]">
                      Score: {(res.similarity_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono bg-surface/80 p-2.5 rounded-lg border border-surface-border/50 line-clamp-4">
                    {res.text_content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      <div className="p-5 rounded-2xl bg-surface border border-surface-border space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-brand-400" />
            Ingested Documents ({documents.length})
          </span>
          <span className="text-[10px] text-slate-500 normal-case font-normal">
            Available to all 10 domain agents
          </span>
        </h4>

        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
            <span className="text-xs font-mono">Loading knowledge base...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-surface-raised/40 border border-dashed border-surface-border space-y-2">
            <FileText className="h-8 w-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">No documents uploaded yet</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Upload existing PRDs, technical RFCs, or swagger docs to enhance domain agent outputs with project context.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border/60">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-surface-raised/30 px-3 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-brand-950/70 border border-brand-500/20 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-brand-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{doc.filename}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-0.5">
                      <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{doc.chunks_count || 0} chunks</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Ingested
                      </span>
                    </div>
                  </div>
                </div>

                {onOpenDocumentTab && (
                  <button
                    onClick={() => onOpenDocumentTab(doc)}
                    className="px-3 py-1.5 rounded-lg bg-surface-raised hover:bg-surface border border-surface-border text-xs text-slate-300 font-mono flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <FileCode className="h-3.5 w-3.5 text-accent-cyan" />
                    <span>Inspect</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
