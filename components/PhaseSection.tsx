"use client";

import { useState } from "react";
import { Phase, Week, TaskStatus } from "@/lib/data";
import WeekPanel from "./WeekPanel";
import clsx from "clsx";

interface Props {
  phase: Phase;
  weeks: Week[];
  taskStatuses: Record<string, TaskStatus>;
  weekNotes: Record<string, string>;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onNoteChange: (weekId: string, note: string) => void;
  phaseDone: number;
  phaseTotal: number;
}

export default function PhaseSection({
  phase,
  weeks,
  taskStatuses,
  weekNotes,
  onStatusChange,
  onNoteChange,
  phaseDone,
  phaseTotal,
}: Props) {
  const [open, setOpen] = useState(phase.number === 1);
  const pct = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;
  const complete = pct === 100;

  return (
    <div className={clsx("phase-" + phase.color, "rounded-2xl border border-ink-700/60 overflow-hidden")}>
      {/* Phase header */}
      <button
        className={clsx(
          "w-full text-left px-5 py-4 flex items-center gap-4 group transition-colors duration-200",
          open ? "bg-ink-800/80" : "bg-ink-800/40 hover:bg-ink-800/60"
        )}
        onClick={() => setOpen(!open)}
      >
        {/* Phase number */}
        <div
          className={clsx(
            "shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg border-2 transition-all duration-300",
            complete
              ? "border-sage-400 text-sage-300 bg-sage-900/30"
              : "border-(--phase-color) text-(--phase-color) bg-(--phase-dim)"
          )}
        >
          {complete ? "✓" : phase.number}
        </div>

        {/* Title + weeks */}
        <div className="flex-1 min-w-0">
          <p className={clsx(
            "font-display text-base font-semibold transition-colors",
            complete ? "text-sage-300" : "text-ink-100 group-hover:text-white"
          )}>
            {phase.title}
          </p>
          <p className="text-xs text-ink-500">{phase.weeks}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span
              className="text-sm font-mono font-medium"
              style={{ color: complete ? "#7eb89a" : phase.accentHex }}
            >
              {phaseDone}/{phaseTotal}
            </span>
            <p className="text-xs text-ink-500">{pct}%</p>
          </div>

          {/* Phase progress bar */}
          <div className="hidden md:block w-20 h-1.5 bg-ink-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: complete
                  ? "#7eb89a"
                  : `linear-gradient(90deg, ${phase.accentHex}80, ${phase.accentHex})`,
              }}
            />
          </div>

          <svg
            className={clsx(
              "w-5 h-5 text-ink-500 transition-transform duration-200",
              open && "rotate-180"
            )}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Weeks */}
      {open && (
        <div className="px-4 pb-4 pt-3 flex flex-col gap-2 animate-fade-up">
          {/* Phase description strip */}
          <div
            className="text-xs px-3 py-2 rounded-lg mb-2 border"
            style={{
              color: phase.accentHex,
              borderColor: `${phase.accentHex}25`,
              backgroundColor: `${phase.accentHex}08`,
            }}
          >
            {pct === 0
              ? `${phaseTotal} tasks to complete across ${weeks.length} week block${weeks.length > 1 ? "s" : ""}.`
              : pct === 100
              ? `Phase complete — all ${phaseTotal} tasks done.`
              : `${phaseDone} of ${phaseTotal} tasks done. ${phaseTotal - phaseDone} remaining.`}
          </div>

          {weeks.map((week, i) => (
            <WeekPanel
              key={week.id}
              week={week}
              phaseColor={phase.color}
              phaseAccent={phase.accentHex}
              taskStatuses={taskStatuses}
              onStatusChange={onStatusChange}
              note={weekNotes[week.id] ?? ""}
              onNoteChange={onNoteChange}
              defaultOpen={i === 0 && phase.number === 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
