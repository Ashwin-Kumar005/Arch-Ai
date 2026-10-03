"use client";

import React from "react";
import { ListChecks, Rocket, Layout, Target, Calendar } from "lucide-react";

export default function RoadmapViewer({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-slate-400 font-mono text-xs">No roadmap data available.</div>;

  const mvpDefinition = data.mvp_definition;
  const userStories = data.user_stories || [];
  const sprintPlan = data.sprint_plan || [];

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-surface-border pb-4">
        <Rocket className="h-6 w-6 text-brand-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono">Product Roadmap & Sprint Plan</h3>
          <p className="text-[11px] text-slate-400 font-mono">MVP Scope, User Stories, and Execution Sprints</p>
        </div>
      </div>

      <div className="space-y-4 overflow-auto">
        <div className="p-4 rounded-xl bg-surface-raised border border-surface-border shadow-sm">
          <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono flex items-center gap-2 mb-2"><Target className="h-4 w-4"/> MVP Definition</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">{mvpDefinition}</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-raised border border-surface-border shadow-sm">
          <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-2 mb-2"><Calendar className="h-4 w-4"/> Sprint Plan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sprintPlan.map((sp: any, i: number) => (
              <div key={i} className="p-3 bg-surface border border-surface-border rounded-lg">
                <div className="text-xs font-bold text-slate-100 mb-1 font-mono">Sprint {sp.sprint_number}: {sp.focus_area} ({sp.duration_weeks} wks)</div>
                <ul className="list-disc pl-4 text-[11px] text-slate-400 font-mono">
                  {sp.deliverables?.map((d: string, j: number) => <li key={j}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-raised border border-surface-border shadow-sm">
          <h4 className="text-xs font-bold text-amber-400 uppercase font-mono flex items-center gap-2 mb-2"><ListChecks className="h-4 w-4"/> User Stories</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userStories.map((story: any, i: number) => (
              <div key={i} className="p-3 bg-surface border border-surface-border rounded-lg font-mono">
                <div className="text-[11px] font-bold text-brand-300 mb-1">{story.id} - {story.priority}</div>
                <div className="text-[11px] text-slate-300 mb-2">As a <strong>{story.as_a}</strong>, I want to <strong>{story.i_want}</strong>, so that <strong>{story.so_that}</strong>.</div>
                <div className="text-[10px] text-slate-400">Acceptance Criteria:</div>
                <ul className="list-disc pl-4 text-[10px] text-slate-400">
                  {story.acceptance_criteria?.map((ac: string, j: number) => <li key={j}>{ac}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
