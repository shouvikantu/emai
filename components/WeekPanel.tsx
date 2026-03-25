"use client";

import { useState } from "react";
import { Week, TaskStatus } from "@/lib/data";
import TaskCard from "./TaskCard";
import clsx from "clsx";

interface Props {
  week: Week;
  phaseColor: string;
  phaseAccent: string;
  taskStatuses: Record<string, TaskStatus>;
  onStatusChange: (id: string, status: TaskStatus) => void;
  note: string;
  onNoteChange: (weekId: string, note: string) => void;
  defaultOpen?: boolean;
}

export default function WeekPanel({
  week,
  phaseColor,
  phaseAccent,
  taskStatuses,
  onStatusChange,
  note,
  onNoteChange,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [showNotes, setShowNotes] = useState(false);

  const done = week.tasks.filter((t) => taskStatuses[t.id] === "done").length;
  const inprog = week.tasks.filter((t) => taskStatuses[t.id] === "inprogress").length;
  const total = week.tasks.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  // Status counts for mini legend
  const todo = total - done - inprog;

  return (
    <div
      className={clsx(
        "rounded-xl border transition-all duration-200 bg-white",
        open
          ? "border-slate-300 shadow-sm"
          : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow"
      )}
    >
      {/* Header */}
      <button
        className="w-full text-left px-4 py-3.5 flex items-center gap-4 group"
        onClick={() => setOpen(!open)}
      >
        {/* Week num */}
        <div
          className="shrink-0 font-mono text-xs font-medium px-2 py-1 rounded border"
          style={{
            color: phaseAccent,
            borderColor: `${phaseAccent}40`,
            backgroundColor: `${phaseAccent}10`,
          }}
        >
          W{week.weekNum}
        </div>

        {/* Focus */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
            {week.focus}
          </p>
          <p className="text-xs text-slate-500 truncate hidden sm:block mt-0.5">
            {week.description}
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            {done > 0 && (
              <span className="text-emerald-500 font-medium">{done}✓</span>
            )}
            {inprog > 0 && (
              <span className="text-amber-500 font-medium">{inprog}~</span>
            )}
            {todo > 0 && (
              <span className="text-slate-400 font-medium">{todo}○</span>
            )}
          </div>

          {/* Mini progress ring */}
          <div className="relative w-8 h-8">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="none" stroke="var(--color-slate-100)" strokeWidth="3" />
              <circle
                cx="16" cy="16" r="12" fill="none"
                stroke={pct === 100 ? "var(--sage-default, #7eb89a)" : phaseAccent}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 12}`}
                strokeDashoffset={`${2 * Math.PI * 12 * (1 - pct / 100)}`}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center font-mono text-center leading-none"
              style={{ fontSize: "8px", color: pct === 100 ? "var(--sage-default, #7eb89a)" : phaseAccent }}
            >
              {Math.round(pct)}
            </span>
          </div>

          {/* Chevron */}
          <svg
            className={clsx(
              "w-4 h-4 text-slate-400 transition-transform duration-200",
              open && "rotate-180"
            )}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4">
          {/* Progress bar */}
          <div className="h-0.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full rounded-full progress-bar-fill transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? "var(--sage-default, #7eb89a)"
                  : `linear-gradient(90deg, ${phaseAccent}88, ${phaseAccent})`,
              }}
            />
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-1.5 mb-3 stagger-children">
            {week.tasks.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                status={taskStatuses[task.id] ?? "todo"}
                onStatusChange={onStatusChange}
                animDelay={i * 30}
              />
            ))}
          </div>

          {/* Quick complete all / reset */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
            <button
              className="text-xs font-medium text-slate-400 hover:text-emerald-600 transition-colors"
              onClick={() =>
                week.tasks.forEach((t) => onStatusChange(t.id, "done"))
              }
            >
              Mark all done
            </button>
            <span className="text-slate-200 text-xs">|</span>
            <button
              className="text-xs font-medium text-slate-400 hover:text-amber-600 transition-colors"
              onClick={() =>
                week.tasks.forEach((t) => onStatusChange(t.id, "todo"))
              }
            >
              Reset week
            </button>
            <span className="text-slate-200 text-xs">|</span>
            <button
              className="text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? "Hide notes" : "Add notes"}
            </button>
          </div>

          {/* Notes */}
          {showNotes && (
            <textarea
              className="mt-4 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700
                         placeholder-slate-400 font-body resize-none focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50
                         transition-all duration-200 animate-fade-up shadow-sm mb-2"
              rows={3}
              placeholder="Notes for this week..."
              value={note}
              onChange={(e) => onNoteChange(week.id, e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}
