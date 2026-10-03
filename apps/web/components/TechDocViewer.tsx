"use client";

import React, { useState } from "react";
import { BookOpen, FileText, Code, Settings } from "lucide-react";

export default function TechDocViewer({ data }: { data: any }) {
  const [activeDoc, setActiveDoc] = useState<string>("srs");

  if (!data) return <div className="p-8 text-center text-slate-400 font-mono text-xs">No Technical Documentation data available.</div>;

  const docs = [
    { id: 'srs', title: 'Software Requirements', content: data.software_requirements_specification, icon: FileText },
    { id: 'arch', title: 'System Architecture', content: data.system_architecture_document, icon: BookOpen },
    { id: 'dev', title: 'Developer Guide', content: data.developer_onboarding_guide, icon: Code },
    { id: 'ops', title: 'Operations Manual', content: data.operations_manual, icon: Settings },
  ];

  const activeContent = docs.find(d => d.id === activeDoc)?.content || "";

  return (
    <div className="flex flex-col h-full bg-surface-300 rounded-2xl border border-surface-border overflow-hidden shadow-card p-6 space-y-4">
      <div className="flex gap-2 border-b border-surface-border pb-4 overflow-x-auto">
        {docs.map(d => {
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDoc(d.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all ${
                activeDoc === d.id ? 'bg-brand-600 text-white' : 'bg-surface text-slate-400 hover:bg-surface-raised'
              }`}
            >
              <Icon className="h-4 w-4" />
              {d.title}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-auto bg-slate-950 rounded-xl border border-surface-border p-5">
        <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
          {activeContent}
        </pre>
      </div>
    </div>
  );
}
