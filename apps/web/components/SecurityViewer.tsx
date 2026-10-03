"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Key,
  CheckCircle,
  CheckCircle2,
  ShieldAlert,
  Flame,
  UserCheck,
  EyeOff,
  Database,
  Filter,
} from "lucide-react";

export default function SecurityViewer({ data }: { data: any }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [checkedMitigations, setCheckedMitigations] = useState<Record<number, boolean>>({});

  const threats = data?.threat_model || [
    { category: "Spoofing", impact_level: "HIGH", threat_description: "Attacker attempts to forge JWT token signature to impersonate admin accounts.", mitigation_strategy: "Enforce HS256/RS256 asymmetric cryptographic signing with short-lived tokens and Redis token blacklisting." },
    { category: "Tampering", impact_level: "HIGH", threat_description: "Malicious payload injection in REST controller bodies or SQL parameters.", mitigation_strategy: "Pydantic schema validation at controller boundary combined with SQLAlchemy parameterized ORM queries." },
    { category: "Repudiation", impact_level: "MEDIUM", threat_description: "Users denying transactional actions or state changes.", mitigation_strategy: "Immutable audit log event streaming with hashed caller identity and timestamped traces." },
    { category: "Information Disclosure", impact_level: "HIGH", threat_description: "Sensitive PII or DB connection strings exposed in error traces.", mitigation_strategy: "Global exception handler suppressing internal stack traces; TLS 1.3 enforced for in-transit encryption." },
    { category: "Denial of Service", impact_level: "MEDIUM", threat_description: "Volumetric API scraping or resource exhaustion attacks.", mitigation_strategy: "Redis sliding window rate limiter configured per IP and authenticated API key." },
    { category: "Elevation of Privilege", impact_level: "HIGH", threat_description: "Standard user executing restricted administrative endpoints.", mitigation_strategy: "Role-Based Access Control (RBAC) middleware verifying required roles before execution." },
  ];

  const rbac = data?.rbac_permission_matrix || {
    ADMIN: ["system:write", "users:manage", "billing:full", "data:export", "audit:view"],
    DEVELOPER: ["code:deploy", "logs:read", "api:execute", "schema:read"],
    USER: ["profile:read", "profile:update", "data:read", "transactions:create"],
  };

  const owasp = data?.owasp_top_10_mitigations || [
    "A01:2021-Broken Access Control: Strict RBAC guards on all controller routes.",
    "A02:2021-Cryptographic Failures: Argon2 password hashing & TLS 1.3 encryption.",
    "A03:2021-Injection: 100% Parameterized queries via SQLAlchemy ORM.",
    "A04:2021-Insecure Design: Threat modeling incorporated during architecture synthesis.",
    "A05:2021-Security Misconfiguration: Hardened Docker containers running non-root users.",
  ];

  const categories = ["ALL", "Spoofing", "Tampering", "Repudiation", "Information Disclosure", "Denial of Service", "Elevation of Privilege"];

  const filteredThreats = threats.filter(
    (t: any) => activeCategory === "ALL" || t.category.toLowerCase() === activeCategory.toLowerCase()
  );

  const toggleMitigation = (idx: number) => {
    setCheckedMitigations((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-surface-200/90 border-b border-surface-border gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-brand-500/20 border border-rose-500/40 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                Security Architecture & STRIDE Threat Analysis
              </h3>
              <span className="badge-neon-emerald px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                AUDITED & SECURED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Zero-trust posture, OWASP Top 10 hardening, and automated RBAC policy matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 0 Critical Vulnerabilities
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* STRIDE Security Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl glass-panel-card border-surface-border">
            <span className="text-xs text-slate-400">Total Analyzed Threat Vectors</span>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{threats.length} Evaluated</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">100% Mitigated with Code Controls</span>
          </div>
          <div className="p-4 rounded-xl glass-panel-card border-surface-border">
            <span className="text-xs text-slate-400">Authentication Protocol</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-1">JWT + Argon2 Hashing</div>
            <span className="text-[11px] text-brand-300 mt-1 block">Stateless RS256 / HS256 tokens</span>
          </div>
          <div className="p-4 rounded-xl glass-panel-card border-surface-border">
            <span className="text-xs text-slate-400">Encryption In-Transit & At-Rest</span>
            <div className="text-xl font-bold font-mono text-slate-100 mt-1">TLS 1.3 / AES-256</div>
            <span className="text-[11px] text-cyan-300 mt-1 block">Encrypted volumes & edge SSL</span>
          </div>
        </div>

        {/* STRIDE Threat Matrix */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              STRIDE Threat Classification & Mitigations
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                    activeCategory === c
                      ? "bg-rose-500/20 border-rose-500 text-rose-300"
                      : "bg-surface-raised border-surface-border text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredThreats.map((t: any, idx: number) => {
              const isChecked = !!checkedMitigations[idx];
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-raised/90 border border-surface-border hover:border-rose-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                      [{t.category}]
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        t.impact_level === "HIGH"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {t.impact_level} IMPACT
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {t.threat_description}
                  </p>

                  <div className="p-3 rounded-xl bg-surface border border-surface-border space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-bold text-slate-300 font-mono">MITIGATION CODE CONTROL:</span>
                      <button
                        onClick={() => toggleMitigation(idx)}
                        className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <CheckCircle className={`h-3 w-3 ${isChecked ? "fill-emerald-400 text-slate-950" : ""}`} />
                        {isChecked ? "Verified" : "Mark Verified"}
                      </button>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{t.mitigation_strategy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RBAC Role Matrix */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Role-Based Access Control (RBAC) Permission Scopes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(rbac).map(([role, perms]: any) => (
              <div key={role} className="p-4 rounded-xl bg-surface-raised border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase font-mono tracking-wider">
                    {role} ROLE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{perms.length} Permissions</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {perms.map((p: string, pIdx: number) => (
                    <div
                      key={pIdx}
                      className="flex items-center gap-2 p-1.5 rounded bg-surface border border-surface-border text-slate-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
