"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  Cpu,
  Layers,
  CheckCircle2,
  Loader2,
  Wand2,
} from "lucide-react";
import { ApiClient } from "@/lib/api";

const SAMPLE_IDEAS = [
  {
    title: "On-demand Home Services Marketplace",
    idea: "I want to build an online marketplace for local service providers where customers can search providers, compare prices, book appointments and pay online with escrow protection.",
    industry: "Home Services / Marketplace",
    scale: "High Growth (100k+ MAU)",
    tech: "Next.js, FastAPI, PostgreSQL, Redis, Stripe Connect, Docker",
  },
  {
    title: "AI Collaborative Code Review Platform",
    idea: "An automated GitHub PR reviewer that runs semantic AST checks, flags security flaws, benchmarks performance regressions, and suggests inline fixes.",
    industry: "Developer Tools / AI",
    scale: "Standard (10k - 50k MAU)",
    tech: "Next.js, Python, PostgreSQL, Redis, Docker, GitHub Apps",
  },
  {
    title: "FinTech Cross-Border Payment Wallet",
    idea: "A multi-currency digital wallet enabling peer-to-peer instant fiat & stablecoin transfers, virtual debit cards, and automated FX rate hedging.",
    industry: "Financial Technology",
    scale: "Enterprise (500k+ MAU)",
    tech: "Next.js, FastAPI, PostgreSQL, Redis, Plaid, Docker",
  },
];

export default function NewProjectWizardPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [rawIdea, setRawIdea] = useState("");
  const [industry, setIndustry] = useState("Marketplace");
  const [targetUsers, setTargetUsers] = useState("Consumers, Service Providers, Admins");
  const [scaleTier, setScaleTier] = useState("High Growth (100k+ MAU)");
  const [techPreferences, setTechPreferences] = useState("Next.js, FastAPI, PostgreSQL, Redis, Docker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof SAMPLE_IDEAS[0]) => {
    setName(preset.title);
    setRawIdea(preset.idea);
    setIndustry(preset.industry);
    setScaleTier(preset.scale);
    setTechPreferences(preset.tech);
  };

  const handleCreateAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rawIdea) {
      setError("Please provide a project name and describe your software idea.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Create Project
      const project = await ApiClient.createProject({
        name,
        description: rawIdea.substring(0, 200),
        industry,
        target_users: targetUsers,
        business_objective: `Automate and scale ${name}`,
        scale_tier: scaleTier,
        tech_preferences: techPreferences,
        raw_idea: rawIdea,
      });

      // 2. Trigger Requirement Analysis
      await ApiClient.analyzeProject(project.id);

      // 3. Navigate to workspace
      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create project");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/60 px-3 py-1 text-xs font-mono text-brand-300 mb-3 shadow-glow">
          <Wand2 className="h-3.5 w-3.5 text-accent-cyan" />
          <span>PROJECT ARCHITECTURE WIZARD</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 font-mono tracking-tight">
          Create New Architecture Project
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Enter your software idea in plain English. ArchAI's Requirement Analyst will dissect requirements and generate blueprints.
        </p>
      </div>

      {/* Quick Preset Cards */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
          Or choose a quick architectural preset:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_IDEAS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-xl bg-surface border border-surface-border hover:border-brand-500/40 text-left transition-all"
            >
              <span className="text-xs font-bold text-slate-200 block mb-1">{preset.title}</span>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.idea}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface border border-surface-border shadow-card space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateAndAnalyze} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-wider font-mono">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Local Services Marketplace"
              className="w-full rounded-xl bg-surface-raised border border-surface-border px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Natural Language Idea Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Describe Your Software Idea (Natural Language)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Unstructured text supported</span>
            </div>
            <textarea
              required
              rows={5}
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              placeholder="Paste your natural language concept, e.g.: 'I want to build an online marketplace for local service providers where customers can search providers, compare prices, book appointments and pay online with escrow protection...'"
              className="w-full rounded-xl bg-surface-raised border border-surface-border p-4 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors font-mono leading-relaxed"
            />
          </div>

          {/* Grid Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 font-mono">
                Industry / Domain
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Marketplace, FinTech, HealthTech, etc."
                className="w-full rounded-xl bg-surface-raised border border-surface-border px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 font-mono">
                Expected Scale Tier
              </label>
              <select
                value={scaleTier}
                onChange={(e) => setScaleTier(e.target.value)}
                className="w-full rounded-xl bg-surface-raised border border-surface-border px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
              >
                <option>Single City Pilot (1k - 5k MAU)</option>
                <option>Standard Growth (10k - 50k MAU)</option>
                <option>High Growth (100k+ MAU)</option>
                <option>Enterprise (1M+ MAU)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 font-mono">
                Target User Personas
              </label>
              <input
                type="text"
                value={targetUsers}
                onChange={(e) => setTargetUsers(e.target.value)}
                placeholder="Homeowners, Contractors, Admins"
                className="w-full rounded-xl bg-surface-raised border border-surface-border px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2 font-mono">
                Preferred Technology Stack
              </label>
              <input
                type="text"
                value={techPreferences}
                onChange={(e) => setTechPreferences(e.target.value)}
                placeholder="Next.js, FastAPI, PostgreSQL, Redis, Docker"
                className="w-full rounded-xl bg-surface-raised border border-surface-border px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-surface-border/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 px-6 py-2.5 text-xs font-semibold text-white shadow-glow transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Dissecting Requirements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Start Architecture & Analysis</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
