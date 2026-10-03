"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Layers,
  Database,
  Globe,
  ShieldCheck,
  CheckSquare,
  Container,
  AlertTriangle,
  HelpCircle,
  FileUp,
  Download,
  Play,
  CheckCircle2,
  Check,
  ArrowRight,
  Loader2,
  Code2,
  Sparkles,
  Zap,
  Activity,
  ChevronRight,
  Boxes,
  Cpu,
} from "lucide-react";
import { ApiClient } from "@/lib/api";
import AgentLiveMonitor from "@/components/AgentLiveMonitor";
import ArchitectureFlowGraph from "@/components/ArchitectureFlowGraph";
import ERDViewer from "@/components/ERDViewer";
import APISpecViewer from "@/components/APISpecViewer";
import SecurityViewer from "@/components/SecurityViewer";
import QAViewer from "@/components/QAViewer";
import DevOpsViewer from "@/components/DevOpsViewer";
import ConsistencyReportViewer from "@/components/ConsistencyReportViewer";
import ExportModal from "@/components/ExportModal";
import DocumentsViewer from "@/components/DocumentsViewer";
import CodebaseStudio from "@/components/CodebaseStudio";
import RoadmapViewer from "@/components/RoadmapViewer";
import UIFlowViewer from "@/components/UIFlowViewer";
import TechDocViewer from "@/components/TechDocViewer";

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<any>(null);
  const [requirements, setRequirements] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("codebase");
  const [answers, setAnswers] = useState<Record<string, { option: string; custom: string }>>({});
  const [submittingAnswers, setSubmittingAnswers] = useState(false);
  const [orchestrating, setOrchestrating] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Deliverables Cache
  const [archData, setArchData] = useState<any>(null);
  const [dbData, setDbData] = useState<any>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [secData, setSecData] = useState<any>(null);
  const [qaData, setQaData] = useState<any>(null);
  const [devopsData, setDevopsData] = useState<any>(null);
  const [valData, setValData] = useState<any>(null);
  const [codebaseData, setCodebaseData] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [uiflowData, setUiflowData] = useState<any>(null);
  const [techdocData, setTechdocData] = useState<any>(null);

  const loadProjectData = async () => {
    if (!projectId) return;
    try {
      const [p, req] = await Promise.all([
        ApiClient.getProject(projectId),
        ApiClient.getRequirements(projectId).catch(() => null),
      ]);
      setProject(p);
      setRequirements(req);

      // Initialize answer states
      if (req?.questions) {
        const initAnswers: Record<string, any> = {};
        for (const q of req.questions) {
          initAnswers[q.id] = {
            option: q.options && q.options.length > 0 ? q.options[0] : "",
            custom: "",
          };
        }
        setAnswers(initAnswers);
      }

      // Pre-fetch deliverables
      if (p?.status === "COMPLETED" || p?.status === "ORCHESTRATING") {
        ApiClient.getArchitecture(projectId).then(setArchData).catch(() => {});
        ApiClient.getDatabase(projectId).then(setDbData).catch(() => {});
        ApiClient.getApiSpec(projectId).then(setApiData).catch(() => {});
        ApiClient.getSecurity(projectId).then(setSecData).catch(() => {});
        ApiClient.getTesting(projectId).then(setQaData).catch(() => {});
        ApiClient.getDeployment(projectId).then(setDevopsData).catch(() => {});
        ApiClient.getValidation(projectId).then(setValData).catch(() => {});
        ApiClient.getCodebase(projectId).then(setCodebaseData).catch(() => {});
        ApiClient.getRoadmap(projectId).then(setRoadmapData).catch(() => {});
        ApiClient.getUIFlow(projectId).then(setUiflowData).catch(() => {});
        ApiClient.getTechDoc(projectId).then(setTechdocData).catch(() => {});
      }
    } catch (err) {
      console.error("Failed loading workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        option,
      },
    }));
  };

  const handleCustomTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        custom: text,
      },
    }));
  };

  const handleAnswerSubmit = async () => {
    setSubmittingAnswers(true);
    try {
      const answersPayload = Object.entries(answers).map(([qId, val]) => ({
        question_id: qId,
        selected_option: val.option,
        custom_text: val.custom,
      }));
      await ApiClient.answerQuestions(projectId, answersPayload);
      await ApiClient.finalizeRequirements(projectId);
      await loadProjectData();
      setActiveTab("finalization");
    } catch (err) {
      alert("Failed to submit answers");
    } finally {
      setSubmittingAnswers(false);
    }
  };

  const handleStartOrchestration = async () => {
    setOrchestrating(true);
    try {
      await ApiClient.startOrchestration(projectId);
      await loadProjectData();
      setActiveTab("codebase");
    } catch (err) {
      alert("Failed to start orchestration");
    } finally {
      setOrchestrating(false);
    }
  };

  const navItems = [
    { key: "codebase", label: "Software Codebase", icon: Code2, badge: "RUNNABLE", highlight: true },
    { key: "roadmap", label: "Roadmap & Sprint Plan", icon: Sparkles },
    { key: "architecture", label: "Architecture Topology", icon: Layers },
    { key: "database", label: "Database & 3NF ERD", icon: Database },
    { key: "api", label: "REST & OpenAPI Specs", icon: Globe },
    { key: "uiflow", label: "UI Flow & Components", icon: Boxes },
    { key: "security", label: "Security & STRIDE", icon: ShieldCheck },
    { key: "testing", label: "QA & Test Suite", icon: CheckSquare },
    { key: "deployment", label: "DevOps & Cloud Cost", icon: Container },
    { key: "validation", label: "Consistency Radar", icon: AlertTriangle },
    { key: "techdoc", label: "Technical Docs", icon: FileText },
    { key: "requirements", label: "Requirements Baseline", icon: FileText },
    { key: "questions", label: "Follow-up Q&A", icon: HelpCircle, badge: requirements?.questions?.length },
    { key: "finalization", label: "Finalized SRS", icon: CheckCircle2 },
    { key: "documents", label: "RAG Knowledge Base", icon: FileUp },
  ];

  // Visual Renderer for Deliverable
  const renderVisualContent = (deliverableKey: string) => {
    switch (deliverableKey) {
      case "codebase":
        return (
          <CodebaseStudio
            codebaseData={codebaseData}
            projectId={projectId}
            onExportZip={() => setExportOpen(true)}
          />
        );

      case "requirements":
        return (
          <div className="max-w-4xl w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  Requirement Analysis Breakdown
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted by the Requirement Analyst Agent from natural language input
                </p>
              </div>
              <button
                onClick={() => setActiveTab("questions")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white shadow-glow transition-all"
              >
                <span>Answer Questions ({requirements?.questions?.length || 0})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-surface-raised border border-surface-border space-y-3 shadow-card">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Executive Project Summary
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                {requirements?.project_summary || project?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border space-y-3">
                <h3 className="text-xs font-bold text-brand-300 uppercase tracking-wider font-mono">
                  Identified Actors
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {requirements?.actors?.map((actor: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold">•</span>
                      <span>{actor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  Business Objectives
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {requirements?.business_goals?.map((goal: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-raised border border-surface-border space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Functional Requirements
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {requirements?.functional_requirements?.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "questions":
        return (
          <div className="max-w-4xl w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100 font-mono">
                  AI Follow-up Clarifications
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Resolve architectural uncertainties before multi-agent synthesis
                </p>
              </div>
              <button
                onClick={handleAnswerSubmit}
                disabled={submittingAnswers}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-xs font-semibold text-white shadow-glow disabled:opacity-50 font-mono transition-all"
              >
                {submittingAnswers ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>Submit & Finalize SRS</span>
              </button>
            </div>

            <div className="space-y-5">
              {requirements?.questions?.map((q: any, idx: number) => {
                const curAns = answers[q.id] || { option: "", custom: "" };
                return (
                  <div key={q.id} className="p-6 rounded-2xl bg-surface-raised border border-surface-border space-y-4 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-brand-400">
                        QUESTION {idx + 1} • {q.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface text-amber-400 border border-amber-500/30">
                        {q.priority} PRIORITY
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100">{q.question_text}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options?.map((opt: string, oIdx: number) => {
                        const isSelected = curAns.option === opt;
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectOption(q.id, opt)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-brand-950/60 border-brand-500 text-brand-200 shadow-glow"
                                : "bg-surface border-surface-border text-slate-300 hover:bg-surface-raised"
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <Check className="h-4 w-4 text-brand-400 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={curAns.custom}
                        onChange={(e) => handleCustomTextChange(q.id, e.target.value)}
                        placeholder="Add custom notes or specific constraints for this question..."
                        className="w-full rounded-xl bg-surface border border-surface-border px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "finalization":
        return (
          <div className="max-w-4xl w-full mx-auto space-y-6">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-brand-950/80 to-surface-raised border border-brand-500/40 shadow-glow">
              <div>
                <h2 className="text-lg font-bold text-slate-100 font-mono">
                  Requirements Finalized & Baseline Approved
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Launch the 10-Agent Autonomous Software Implementation Pipeline
                </p>
              </div>

              <button
                onClick={handleStartOrchestration}
                disabled={orchestrating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-xs font-bold text-white shadow-glow disabled:opacity-50 font-mono transition-all"
              >
                {orchestrating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
                <span>Synthesize Software Codebase</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-surface-raised border border-surface-border space-y-4 shadow-card">
              <h3 className="text-sm font-bold text-slate-200 font-mono">
                Software Requirements Specification (SRS Baseline)
              </h3>
              <div className="p-4 rounded-xl bg-surface border border-surface-border font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(requirements?.finalized_srs || requirements?.project_summary, null, 2)}
              </div>
            </div>
          </div>
        );

      case "roadmap":
        return <RoadmapViewer data={roadmapData} />;

      case "architecture":
        return <ArchitectureFlowGraph data={archData} />;

      case "database":
        return <ERDViewer data={dbData} />;

      case "api":
        return <APISpecViewer data={apiData} />;

      case "uiflow":
        return <UIFlowViewer data={uiflowData} />;

      case "security":
        return <SecurityViewer data={secData} />;

      case "testing":
        return <QAViewer data={qaData} />;

      case "deployment":
        return <DevOpsViewer data={devopsData} />;

      case "validation":
        return <ConsistencyReportViewer data={valData} />;

      case "techdoc":
        return <TechDocViewer data={techdocData} />;

      case "documents":
        return (
          <div className="max-w-4xl w-full mx-auto">
            <DocumentsViewer projectId={projectId} />
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            Select a deliverable from the sidebar.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-xs font-mono text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-brand-400" />
        Loading ArchAI Studio Workspace...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Left Sidebar Navigation */}
      <aside className="w-full lg:w-68 border-r border-surface-border bg-surface-200/90 backdrop-blur-md flex flex-col shrink-0">
        {/* Project Header */}
        <div className="p-4.5 border-b border-surface-border space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Active Project Studio
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                project?.status === "COMPLETED"
                  ? "badge-neon-emerald"
                  : project?.status === "ORCHESTRATING"
                  ? "badge-neon-cyan animate-pulse"
                  : "bg-surface text-slate-400 border border-surface-border"
              }`}
            >
              {project?.status}
            </span>
          </div>

          <h2 className="text-sm font-bold text-slate-100 truncate" title={project?.name}>
            {project?.name}
          </h2>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-slate-400">10 AI Agents Active</span>
            <button
              onClick={() => setExportOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-raised hover:bg-brand-600/20 border border-surface-border text-[11px] font-mono text-brand-300 hover:text-white transition-all shadow-glow"
            >
              <Download className="h-3.5 w-3.5" />
              Export ZIP
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-600 text-white shadow-glow font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-surface-raised"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : item.highlight ? "text-cyan-400" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.highlight
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-surface text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Center Master Canvas */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-background p-6">
        {renderVisualContent(activeTab)}
      </main>

      {/* Right Live Agent Panel */}
      <AgentLiveMonitor projectId={projectId} onRunComplete={loadProjectData} />

      {/* Export Modal */}
      <ExportModal
        projectId={projectId}
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}
