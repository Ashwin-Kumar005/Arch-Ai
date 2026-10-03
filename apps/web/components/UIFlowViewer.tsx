"use client";

import React from "react";
import { Layout, Monitor, Component } from "lucide-react";

export default function UIFlowViewer({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-slate-400 font-mono text-xs">No UI Flow data available.</div>;

  const screens = data.screens || [];
  const components = data.component_hierarchy || [];

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-surface-border pb-4">
        <Layout className="h-6 w-6 text-cyan-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono">UI Flow & Component Hierarchy</h3>
          <p className="text-[11px] text-slate-400 font-mono">Frontend Architecture, Screens, and Navigation</p>
        </div>
      </div>

      <div className="space-y-4 overflow-auto">
        <div className="p-4 rounded-xl bg-surface-raised border border-surface-border shadow-sm">
          <h4 className="text-xs font-bold text-brand-400 uppercase font-mono flex items-center gap-2 mb-3"><Monitor className="h-4 w-4"/> Screens & Routes</h4>
          <div className="grid grid-cols-1 gap-3">
            {screens.map((s: any, i: number) => (
              <div key={i} className="p-3 bg-surface border border-surface-border rounded-lg font-mono text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-100">{s.name}</span>
                  <span className="text-[10px] bg-cyan-900/40 text-cyan-400 px-2 py-0.5 rounded">{s.route_path}</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">{s.description}</p>
                <div className="text-[10px] text-slate-500">Components: {s.components?.join(', ')}</div>
                <div className="text-[10px] text-slate-500">APIs: {s.api_endpoints_used?.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-raised border border-surface-border shadow-sm">
          <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-2 mb-3"><Component className="h-4 w-4"/> Component Hierarchy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {components.map((c: any, i: number) => (
              <div key={i} className="p-3 bg-surface border border-surface-border rounded-lg font-mono text-xs">
                <div className="font-bold text-slate-200">{c.name} <span className="text-[10px] font-normal text-slate-500 ml-1">({c.category})</span></div>
                <p className="text-[10px] text-slate-400 mt-1">{c.description}</p>
                {c.props?.length > 0 && (
                  <div className="text-[10px] text-emerald-400 mt-2">Props: {c.props.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
