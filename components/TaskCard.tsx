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
        "group flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer select-none animate-slide-in",
        status === "done"
          ? "bg-ink-800/40 border-ink-700/40 opacity-70 hover:opacity-90"
          : status === "inprogress"
          ? "bg-amber-900/20 border-amber-700/40 hover:border-amber-500/60"
          : "bg-ink-800/60 border-ink-700/50 hover:border-ink-500/60 hover:bg-ink-800"
      )}
      style={{ animationDelay: `${animDelay}ms` }}
      onClick={() => onStatusChange(task.id, next)}
      title={`Click to mark as: ${next}`}
    >
      {/* Status toggle */}
      <button
        className={clsx(
          "flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
          status === "done"
            ? "bg-sage-400 border-sage-400 text-ink-900"
            : status === "inprogress"
            ? "bg-amber-500/30 border-amber-500 text-amber-400"
            : "bg-transparent border-ink-500 group-hover:border-ink-300"
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
              "text-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded",
              status === "done"
                ? "text-ink-500 bg-ink-700/50"
                : task.type === "code"
                ? "text-sage-300 bg-sage-900/40"
                : task.type === "check"
                ? "text-amber-300 bg-amber-900/40"
                : task.type === "watch"
                ? "text-blue-300 bg-blue-900/30"
                : task.type === "install"
                ? "text-coral-400 bg-coral-600/20"
                : "text-ink-400 bg-ink-700/50"
            )}
          >
            {TYPE_LABEL[task.type]}
          </span>
        </div>
        <p
          className={clsx(
            "text-sm leading-snug transition-colors duration-200",
            status === "done"
              ? "task-done-text text-ink-500"
              : status === "inprogress"
              ? "text-amber-100"
              : "text-ink-200 group-hover:text-ink-100"
          )}
        >
          {task.text}
        </p>
      </div>

      {/* Status pill */}
      <div className="flex-shrink-0 mt-0.5">
        <span
          className={clsx(
            "text-xs px-2 py-0.5 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity duration-150",
            status === "done"
              ? "hidden"
              : status === "inprogress"
              ? "border-amber-600/40 text-amber-500 bg-amber-900/30"
              : "border-ink-600 text-ink-500 bg-ink-800"
          )}
        >
          → {next}
        </span>
      </div>
    </div>
  );
}
