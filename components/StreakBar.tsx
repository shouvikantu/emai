"use client";

import { DayLog } from "@/lib/store";

interface Props {
  streak: number;
  dayLogs: DayLog[];
  totalDone: number;
  totalTasks: number;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getLast14Days(): string[] {
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const DAY_LABELS = ["S","M","T","W","T","F","S"];

export default function StreakBar({ streak, dayLogs, totalDone, totalTasks }: Props) {
  const days = getLast14Days();
  const logMap = Object.fromEntries(dayLogs.map((d) => [d.date, d.tasksCompleted]));
  const today = todayStr();
  const pct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: streak + overall progress */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* Streak badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center border-[1.5px] font-bold text-2xl shadow-sm
                ${streak > 0
                  ? "border-amber-400 text-amber-500 animate-pulse-glow bg-amber-50"
                  : "border-slate-200 text-slate-400 bg-slate-50"
                }`}
            >
              {streak}
            </div>
            <span className="absolute -bottom-1 -right-1 text-lg drop-shadow-sm">
              {streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "○"}
            </span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Day streak</p>
            <p className="text-sm text-slate-700 font-semibold tracking-tight">
              {streak === 0
                ? "Start today"
                : streak === 1
                ? "1 day — keep going"
                : `${streak} days strong`}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-slate-200 hidden sm:block" />

        {/* Overall progress */}
        <div className="flex-1 min-w-[180px]">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Overall progress</span>
            <span className="text-amber-500 font-semibold tracking-wide">{totalDone} / {totalTasks}</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-linear-to-r from-amber-500 to-amber-300 rounded-full progress-bar-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-right text-xs font-medium text-slate-400 mt-1.5">{pct}% complete</p>
        </div>
      </div>

      {/* 14-day activity grid */}
      <div>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-3">Last 14 days</p>
        <div className="flex gap-1.5 items-end">
          {days.map((date) => {
            const count = logMap[date] ?? 0;
            const isToday = date === today;
            const height = count === 0 ? 8 : Math.min(8 + count * 6, 40);
            return (
              <div
                key={date}
                className="flex flex-col items-center gap-1 flex-1"
                title={`${date}: ${count} tasks`}
              >
                <div
                  className={`w-full rounded-sm transition-all duration-300
                    ${count === 0
                      ? "bg-slate-100"
                      : count >= 5
                      ? "bg-amber-400"
                      : count >= 2
                      ? "bg-amber-300"
                      : "bg-amber-200"
                    }
                    ${isToday ? "ring-1 ring-amber-400 ring-offset-1 ring-offset-white" : ""}
                  `}
                  style={{ height: `${height}px` }}
                />
                <span className="text-slate-400 font-medium mt-0.5" style={{ fontSize: "9px" }}>
                  {DAY_LABELS[new Date(date + "T00:00:00").getDay()]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
