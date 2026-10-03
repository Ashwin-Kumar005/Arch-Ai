"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Database,
  Terminal,
  Activity,
  FileCode,
  Lock,
  Code2,
  Download,
  Check,
  X,
  Container,
  Flame,
} from "lucide-react";

export default function LandingPage() {
  const agentPills = [
    { name: "Requirement Analyst", color: "text-brand-400" },
    { name: "Product Manager", color: "text-accent-cyan" },
    { name: "Solution Architect", color: "text-emerald-400" },
    { name: "Database Architect", color: "text-amber-400" },
    { name: "Backend Engineer", color: "text-brand-300" },
    { name: "Frontend Planner", color: "text-rose-400" },
    { name: "DevOps Engineer", color: "text-accent-teal" },
    { name: "Security Expert", color: "text-red-400" },
    { name: "QA Engineer", color: "text-blue-400" },
    { name: "Technical Writer", color: "text-purple-300" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,58,237,0.18),rgba(255,255,255,0))]">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/60 px-4 py-1 text-xs font-mono text-brand-300 shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
            <span>ARCHAI 2.0 • AUTONOMOUS SOFTWARE IMPLEMENTATION & ARCHITECT ENGINE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            From Concept to <br />
            <span className="gradient-text">Executable Software Implementation</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-3xl text-base md:text-lg text-slate-400 leading-relaxed">
            Unlike legacy diagramming tools that stop at boxes and arrows, ArchAI orchestrates 10 specialized domain AI agents to generate <strong>interactive system topology</strong>, <strong>3NF PostgreSQL DDL</strong>, <strong>REST API controllers</strong>, and a <strong>complete runnable codebase repository</strong> in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/projects/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all"
            >
              Start Architecture & Code Generation
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-surface-raised hover:bg-surface border border-surface-border px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors"
            >
              <Cpu className="h-4 w-4 text-accent-cyan" />
              Open Projects Dashboard
            </Link>
          </div>

          {/* 10 Agents Badge Row */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {agentPills.map((a, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-surface-raised/80 border border-surface-border text-[11px] font-mono font-medium text-slate-300"
              >
                <span className={`mr-1.5 font-bold ${a.color}`}>●</span>
                {a.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Differentiator Banner: Real Codebase Synthesis */}
      <section className="px-6 py-12 bg-gradient-to-b from-brand-950/40 via-surface to-background border-y border-brand-500/20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-accent-cyan font-bold">
                <Flame className="h-4 w-4" />
                <span>MARKET DIFFERENTIATOR</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-mono text-slate-100">
                Not Just Diagrams — Real Working Full-Stack Codebases
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Traditional architecture platforms leave you with static PNGs or text outlines. ArchAI bridges the gap by synthesizing a structured, production-ready repository scaffold complete with FastAPI controllers, SQLAlchemy models, Next.js dashboard UI, PostgreSQL 3NF scripts, and Docker Compose orchestration.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-surface-raised border border-surface-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Full Backend Controllers</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-raised border border-surface-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>3NF Relational Schemas</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-raised border border-surface-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Next.js/React Dashboards</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-raised border border-surface-border flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Docker & CI/CD Pipeline</span>
                </div>
              </div>
            </div>

            {/* Code Studio Mockup Preview */}
            <div className="rounded-2xl overflow-hidden border border-brand-500/30 bg-[#030509] shadow-2xl font-mono text-xs">
              <div className="p-3 bg-surface border-b border-surface-border flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-300 ml-2">backend/app/main.py</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-brand-950 text-accent-cyan text-[10px]">FASTAPI 0.110+</span>
              </div>
              <div className="p-4 text-slate-300 leading-relaxed overflow-x-auto text-[11px] space-y-1">
                <p className="text-purple-400">from fastapi import FastAPI, Depends, HTTPException</p>
                <p className="text-purple-400">from app.api.v1.router import api_v1_router</p>
                <p className="text-purple-400">from app.core.config import settings</p>
                <p className="text-slate-500 mt-2"># Generated by ArchAI Autonomous Software Architect</p>
                <p className="text-slate-200">app = FastAPI(title=settings.APP_NAME, version="1.0.0")</p>
                <p className="text-cyan-400">app.include_router(api_v1_router, prefix="/api/v1")</p>
                <p className="text-emerald-400">@app.get("/health")</p>
                <p className="text-slate-200">async def health(): return {`{"status": "HEALTHY", "db": "CONNECTED"}`}</p>
              </div>
              <div className="p-2.5 bg-surface-raised/70 border-t border-surface-border flex items-center justify-between text-[10px] text-slate-400">
                <span>1-Click Download Repository (ZIP)</span>
                <span className="text-emerald-400 font-semibold">100% Executable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Comparison Matrix */}
      <section className="px-6 py-20 bg-surface/30">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold font-mono text-slate-100">
              Why ArchAI Outclasses the Software Market
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Compare ArchAI against traditional diagramming tools and generic AI chatbots
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-raised text-slate-300">
                    <th className="p-4 font-bold">Capabilities & Deliverables</th>
                    <th className="p-4 font-bold text-accent-cyan bg-brand-950/60 border-x border-brand-500/30">
                      ArchAI 2.0 Engine
                    </th>
                    <th className="p-4 text-slate-400">Eraser.io / Miro</th>
                    <th className="p-4 text-slate-400">ChatGPT / Claude (Raw)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-slate-300">
                  <tr>
                    <td className="p-4 font-semibold text-slate-200">
                      Full Executable Codebase Scaffold (Backend + Frontend)
                    </td>
                    <td className="p-4 text-emerald-400 bg-brand-950/40 border-x border-brand-500/30 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> YES (Runnable Repo)
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Diagrams Only
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Disjointed Snippets
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-200">
                      10 Autonomous Domain Agents Dependency Graph
                    </td>
                    <td className="p-4 text-emerald-400 bg-brand-950/40 border-x border-brand-500/30 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> YES (5-Stage DAG)
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> None
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Single prompt
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-200">
                      3NF Relational SQL DDL & SQLAlchemy ORM
                    </td>
                    <td className="p-4 text-emerald-400 bg-brand-950/40 border-x border-brand-500/30 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> YES (PostgreSQL 16)
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Manual drawing
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Hallucinated types
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-200">
                      OpenAPI 3.1 & REST Controllers Specification
                    </td>
                    <td className="p-4 text-emerald-400 bg-brand-950/40 border-x border-brand-500/30 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> YES (Validated Spec)
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> No
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Partial text
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-200">
                      STRIDE Threat Model & OWASP Security Assessment
                    </td>
                    <td className="p-4 text-emerald-400 bg-brand-950/40 border-x border-brand-500/30 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> YES (Automated)
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> No
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Inconsistent
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-200">
                      Cross-Domain Consistency & Contradiction Engine
                    </td>
                    <td className="p-4 text-emerald-400 bg-brand-950/40 border-x border-brand-500/30 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> YES (Audit Score)
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> No
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> No validation
                    </td>
                  </tr>

                  <tr>
                    <td className="p-4 font-semibold text-slate-200">
                      1-Click Full Architecture & Code ZIP Package
                    </td>
                    <td className="p-4 text-emerald-400 bg-brand-950/40 border-x border-brand-500/30 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> YES (Multi-format)
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> PNG / PDF only
                    </td>
                    <td className="p-4 text-slate-500">
                      <X className="h-4 w-4 inline mr-1 text-red-400" /> Manual copy/paste
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Value Stream Workflow */}
      <section className="px-6 py-16 bg-surface/40 border-y border-surface-border">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-100 font-mono">
              The 5-Stage Multi-Agent Orchestration Pipeline
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Autonomous domain specialists executing in dependency-aware stages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
              <span className="text-xs font-mono font-bold text-brand-400 block mb-1">STAGE 1</span>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Requirement Analysis</h3>
              <p className="text-xs text-slate-400">Extracts actors, business goals, and formulates targeted follow-up questions.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
              <span className="text-xs font-mono font-bold text-accent-cyan block mb-1">STAGE 2</span>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Product & Solution</h3>
              <p className="text-xs text-slate-400">Generates MVP user stories, sprint plan, system topology, and ADRs.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
              <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">STAGE 3</span>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Domain Engineering</h3>
              <p className="text-xs text-slate-400">Synthesizes PostgreSQL DDL, REST OpenAPI 3.1 specs, and UI wireframes.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
              <span className="text-xs font-mono font-bold text-amber-400 block mb-1">STAGE 4</span>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Ops, Security & QA</h3>
              <p className="text-xs text-slate-400">Produces STRIDE threat models, Pytest suites, Docker & CI/CD cost plans.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-raised border border-surface-border">
              <span className="text-xs font-mono font-bold text-purple-400 block mb-1">STAGE 5</span>
              <h3 className="text-sm font-bold text-slate-200 mb-1">Codebase & Validation</h3>
              <p className="text-xs text-slate-400">Validates cross-domain consistency and synthesizes the full software repository.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-border py-8 px-6 bg-surface/50 text-center text-xs text-slate-500 font-mono">
        <p>ARCHAI • Autonomous Software Implementation & Solution Architect Platform • 2026</p>
      </footer>
    </div>
  );
}
