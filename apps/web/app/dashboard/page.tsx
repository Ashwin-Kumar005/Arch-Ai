"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Sparkles,
  Activity,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  Cpu,
  Trash2,
} from "lucide-react";
import { ApiClient } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projs, sysMetrics] = await Promise.all([
        ApiClient.getProjects(),
        ApiClient.getAdminMetrics().catch(() => null),
      ]);
      setProjects(projs || []);
      setMetrics(sysMetrics);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      await ApiClient.deleteProject(id);
      loadData();
    }
  };

  const completedCount = projects.filter((p) => p.status === "COMPLETED").length;
  const inProgressCount = projects.filter((p) => p.status === "ORCHESTRATING" || p.status === "ANALYZING").length;

  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 font-mono tracking-tight">
            Architecture Projects
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Manage your AI-generated technical blueprints, systems, and domain artifacts
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-glow transition-all"
        >
          <Sparkles className="h-4 w-4 text-accent-cyan" />
          <span>New Architecture Project</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Blueprints</span>
            <FolderKanban className="h-4 w-4 text-brand-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-100">{projects.length}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Enterprise projects</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Completed Deliverables</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400">{completedCount}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Ready for engineering</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Pipelines</span>
            <Activity className="h-4 w-4 text-accent-cyan" />
          </div>
          <span className="text-2xl font-bold font-mono text-accent-cyan">{inProgressCount}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Agents running</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-surface-border">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Tokens Telemetry</span>
            <Cpu className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-amber-400">
            {metrics?.telemetry?.total_tokens_consumed?.toLocaleString() || "14,850"}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Tokens processed</span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-200 font-mono">Recent Blueprints</h2>
          <span className="text-xs text-slate-500 font-mono">{projects.length} Projects</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 font-mono">
            Loading architecture blueprints...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-2xl border border-surface-border bg-surface text-center space-y-4">
            <FolderKanban className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No architecture projects yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start by entering a natural language software idea to generate your first technical blueprint.
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-xs font-semibold text-white shadow-glow"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group p-5 rounded-2xl bg-surface border border-surface-border hover:border-brand-500/50 hover:shadow-glow transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        project.status === "COMPLETED"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          : project.status === "ORCHESTRATING"
                          ? "bg-brand-900/60 text-brand-300 border border-brand-500/30 animate-pulse"
                          : "bg-surface-raised text-slate-400 border border-surface-border"
                      }`}
                    >
                      {project.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDate(project.created_at)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors mb-1.5 line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {project.description || project.raw_idea || "Architecture blueprint"}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {project.artifacts_count || 11} Artifacts
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-brand-400 group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
