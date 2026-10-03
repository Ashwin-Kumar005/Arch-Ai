"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Cpu,
  Layers,
  Sparkles,
  User,
  LogOut,
  FolderKanban,
  Activity,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { ApiClient } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    ApiClient.clearToken();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Brand & Title */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-cyan p-0.5 shadow-glow">
              <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-background">
                <Cpu className="h-4 w-4 text-brand-400 group-hover:text-accent-cyan transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-slate-100 font-mono">
                  ARCH<span className="text-accent-cyan">AI</span>
                </span>
                <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-surface-border flex items-center gap-1">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                AI Software Solution Architect
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-surface-raised text-brand-300 border border-brand-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface"
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <Link
              href="/projects/new"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === "/projects/new"
                  ? "bg-surface-raised text-brand-300 border border-brand-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
              New Blueprint
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/projects/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white shadow-glow transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Create Architecture
          </Link>

          <div className="flex items-center gap-2 border-l border-surface-border pl-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-surface-raised border border-brand-500/30 flex items-center justify-center text-xs font-medium text-brand-300">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200">Architect</span>
                <span className="text-[10px] text-slate-400">Lead Enterprise</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-surface-raised rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
