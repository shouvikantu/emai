"use client";

import { Task, TaskStatus } from "@/lib/data";
import clsx from "clsx";

const TYPE_ICON: Record<Task["type"], string> = {
  read: "📖",
  code: "💻",
  check: "✓",
  watch: "▶",
  install: "⚙",
};

const TYPE_LABEL: Record<Task["type"], string> = {
  read: "Read",
  code: "Code",
  check: "Self-check",
  watch: "Watch",
  install: "Install",
};

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  todo: "inprogress",
  inprogress: "done",
  done: "todo",
};

interface Props {
  task: Task;
  status: TaskStatus;
  onStatusChange: (id: string, status: TaskStatus) => void;
  animDelay?: number;
}

export default function TaskCard({ task, status, onStatusChange, animDelay = 0 }: Props) {
  const next = STATUS_CYCLE[status];

  return (
    <div
      className={clsx(
        "group flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer select-none animate-slide-in shadow-sm hover:shadow-md",
        status === "done"
          ? "bg-slate-50 border-slate-200 opacity-60 hover:opacity-100"
          : status === "inprogress"
          ? "bg-amber-50 border-amber-300 ring-1 ring-amber-500/20"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      )}
      style={{ animationDelay: `${animDelay}ms` }}
      onClick={() => onStatusChange(task.id, next)}
      title={`Click to mark as: ${next}`}
    >
      {/* Status toggle */}
      <button
        className={clsx(
          "shrink-0 mt-0.5 w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-all duration-200",
          status === "done"
            ? "bg-emerald-500 border-emerald-500 text-white"
            : status === "inprogress"
            ? "bg-amber-100 border-amber-500 text-amber-500"
            : "bg-transparent border-slate-300 group-hover:border-slate-400"
        )}
        aria-label={`Task status: ${status}`}
      >
        {status === "done" && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === "inprogress" && (
          <div className="w-2 h-2 rounded-sm bg-amber-400" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs opacity-60" title={TYPE_LABEL[task.type]}>
            {TYPE_ICON[task.type]}
          </span>
          <span
            className={clsx(
              "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full",
              status === "done"
                ? "text-slate-500 bg-slate-100"
                : task.type === "code"
                ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/10"
                : task.type === "check"
                ? "text-amber-700 bg-amber-50 ring-1 ring-amber-600/10"
                : task.type === "watch"
                ? "text-blue-700 bg-blue-50 ring-1 ring-blue-600/10"
                : task.type === "install"
                ? "text-rose-700 bg-rose-50 ring-1 ring-rose-600/10"
                : "text-slate-600 bg-slate-100 ring-1 ring-slate-500/10"
            )}
          >
            {TYPE_LABEL[task.type]}
          </span>
        </div>
        <p
          className={clsx(
            "text-sm leading-snug transition-colors duration-200 mt-1",
            status === "done"
              ? "task-done-text text-slate-400"
              : status === "inprogress"
              ? "text-amber-900 font-medium"
              : "text-slate-700 group-hover:text-slate-900"
          )}
        >
          {task.text}
        </p>
      </div>

      {/* Status pill */}
      <div className="shrink-0 mt-0.5">
        <span
          className={clsx(
            "text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm",
            status === "done"
              ? "hidden"
              : status === "inprogress"
              ? "border-amber-200 text-amber-700 bg-white"
              : "border-slate-200 text-slate-500 bg-white"
          )}
        >
          → {next}
        </span>
      </div>
    </div>
  );
}
