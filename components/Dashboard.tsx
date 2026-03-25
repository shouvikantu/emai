"use client";

import { useState } from "react";
import { PHASES, WEEKS } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import StreakBar from "./StreakBar";
import PhaseSection from "./PhaseSection";
import KnowledgeTree from "./KnowledgeTree";
import clsx from "clsx";

type Tab = "plan" | "tree";

export default function Dashboard() {
  const store = useAppStore();
  const [tab, setTab] = useState<Tab>("plan");
  const [showReset, setShowReset] = useState(false);

  if (!store.hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Aggregate total done/total
  const allTasks = WEEKS.flatMap((w) => w.tasks);
  const totalDone = allTasks.filter(
    (t) => store.getTaskStatus(t.id) === "done"
  ).length;
  const totalTasks = allTasks.length;

  return (
    <div className="noise min-h-screen">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Erasmus Master · UPF Barcelona
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                EMAI Prep
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                April → September 2026 · 22 weeks · 5 courses
              </p>
            </div>

            <button
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors mt-1 font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow"
              onClick={() => setShowReset(true)}
            >
              Reset Data
            </button>
          </div>

          {/* Streak + overall progress */}
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <StreakBar
              streak={store.streak}
              dayLogs={store.state.dayLogs}
              totalDone={totalDone}
              totalTasks={totalTasks}
            />
          </div>
        </header>

        {/* ── Phase summary pills ─────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {PHASES.map((phase) => {
            const phaseWeeks = WEEKS.filter((w) => w.phaseId === phase.id);
            const { done, total } = store.getPhaseProgress(
              phaseWeeks.map((w) => w.id),
              WEEKS
            );
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div
                key={phase.id}
                className={clsx(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all shadow-sm",
                  pct === 0 && "bg-white border-slate-200 text-slate-500"
                )}
                style={
                  pct > 0
                    ? {
                        borderColor: `${phase.accentHex}40`,
                        backgroundColor: `${phase.accentHex}10`,
                        color: phase.accentHex,
                      }
                    : {}
                }
              >
                <span>P{phase.number}</span>
                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100 ? "var(--color-emerald-500)" : phase.accentHex,
                    }}
                  />
                </div>
                <span>{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* ── Tab bar ─────────────────────────────────────────── */}
        <div className="flex gap-1 bg-slate-100/50 border border-slate-200/60 rounded-xl p-1 mb-8 w-fit">
          {(["plan", "tree"] as Tab[]).map((t) => (
            <button
              key={t}
              className={clsx(
                "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                tab === t
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-900/5"
                  : "text-slate-500 hover:text-slate-700"
              )}
              onClick={() => setTab(t)}
            >
              {t === "plan" ? "📋  Study Plan" : "🌿  Knowledge Tree"}
            </button>
          ))}
        </div>

        {/* ── Plan tab ─────────────────────────────────────────── */}
        {tab === "plan" && (
          <div className="flex flex-col gap-4 stagger-children">
            {PHASES.map((phase) => {
              const phaseWeeks = WEEKS.filter((w) => w.phaseId === phase.id);
              const taskIds = phaseWeeks.flatMap((w) => w.tasks.map((t) => t.id));
              const taskStatuses = Object.fromEntries(
                taskIds.map((id) => [id, store.getTaskStatus(id)])
              );
              const { done, total } = store.getPhaseProgress(
                phaseWeeks.map((w) => w.id),
                WEEKS
              );

              return (
                <PhaseSection
                  key={phase.id}
                  phase={phase}
                  weeks={phaseWeeks}
                  taskStatuses={taskStatuses}
                  weekNotes={store.state.weekNotes}
                  onStatusChange={store.setTaskStatus}
                  onNoteChange={store.setWeekNote}
                  phaseDone={done}
                  phaseTotal={total}
                />
              );
            })}
          </div>
        )}

        {/* ── Knowledge tree tab ──────────────────────────────── */}
        {tab === "tree" && (
          <div className="animate-fade-up">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">Knowledge Dependency Graph</h2>
                <p className="text-sm text-slate-500">
                  Nodes light up as you complete tasks. Edges show dependencies — a skill unlocks when its prerequisites are done. Hover nodes for details.
                </p>
              </div>
              <KnowledgeTree getNodeCompletion={store.getNodeCompletion} />
            </div>

            {/* Node list below tree */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["p1","p2","p3","p4"].map((phaseId) => {
                const phase = PHASES.find((p) => p.id === phaseId)!;
                const nodes = WEEKS.flatMap(() => []).concat(); // placeholder
                return null;
              })}
            </div>
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
            EMAI @ UPF · Semester 1 · Progress saved locally or in Supabase
          </p>
        </footer>
      </div>

      {/* ── Reset confirm modal ──────────────────────────────── */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full mx-4 animate-fade-up shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-2">Reset all progress?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              This will clear all task completions, streaks, and notes. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-sm"
                onClick={() => {
                  store.resetAll();
                  setShowReset(false);
                }}
              >
                Reset everything
              </button>
              <button
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold transition-colors bg-slate-50 hover:bg-slate-100"
                onClick={() => setShowReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
