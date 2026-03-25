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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-ink-500">
          <div className="w-4 h-4 rounded-full border-2 border-ink-500 border-t-amber-400 animate-spin" />
          <span className="text-sm font-mono">Loading...</span>
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
              <p className="text-xs font-mono text-amber-500/80 uppercase tracking-[0.2em] mb-1">
                Erasmus Master · UPF Barcelona
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-50 leading-tight">
                EMAI Prep
              </h1>
              <p className="text-ink-400 text-sm mt-1">
                April → September 2026 · 22 weeks · 5 courses
              </p>
            </div>

            <button
              className="text-xs text-ink-600 hover:text-coral-400 transition-colors mt-1 font-mono"
              onClick={() => setShowReset(true)}
            >
              reset
            </button>
          </div>

          {/* Streak + overall progress */}
          <div className="mt-6 bg-ink-800/60 border border-ink-700/50 rounded-2xl p-4 sm:p-5">
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all"
                style={{
                  borderColor: pct > 0 ? `${phase.accentHex}50` : "#1e2235",
                  backgroundColor: pct > 0 ? `${phase.accentHex}10` : "#12141f",
                  color: pct > 0 ? phase.accentHex : "#3d4060",
                }}
              >
                <span>P{phase.number}</span>
                <div className="w-12 h-1 bg-ink-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100 ? "#7eb89a" : phase.accentHex,
                    }}
                  />
                </div>
                <span>{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* ── Tab bar ─────────────────────────────────────────── */}
        <div className="flex gap-1 bg-ink-800/60 border border-ink-700/50 rounded-xl p-1 mb-6 w-fit">
          {(["plan", "tree"] as Tab[]).map((t) => (
            <button
              key={t}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                tab === t
                  ? "bg-ink-700 text-ink-100 shadow-sm"
                  : "text-ink-500 hover:text-ink-300"
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
            <div className="bg-ink-800/60 border border-ink-700/50 rounded-2xl p-4 sm:p-6">
              <div className="mb-4">
                <h2 className="font-display text-xl text-ink-100 mb-1">Knowledge Dependency Graph</h2>
                <p className="text-sm text-ink-500">
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
        <footer className="mt-12 pt-6 border-t border-ink-800 text-center">
          <p className="text-xs text-ink-700 font-mono">
            EMAI @ UPF · Semester 1 · Progress saved locally in your browser
          </p>
        </footer>
      </div>

      {/* ── Reset confirm modal ──────────────────────────────── */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/80 backdrop-blur-sm">
          <div className="bg-ink-800 border border-ink-600 rounded-2xl p-6 max-w-sm w-full mx-4 animate-fade-up shadow-2xl">
            <h3 className="font-display text-lg text-ink-100 mb-2">Reset all progress?</h3>
            <p className="text-sm text-ink-400 mb-5">
              This will clear all task completions, streaks, and notes. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-coral-600 hover:bg-coral-500 text-white text-sm font-medium transition-colors"
                onClick={() => {
                  store.resetAll();
                  setShowReset(false);
                }}
              >
                Reset everything
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-ink-600 hover:border-ink-400 text-ink-300 text-sm font-medium transition-colors"
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
