# EMAI Prep — UPF Semester 1 Study Tracker

A full-featured study tracker for the EMAI programme at UPF Barcelona. Built with Next.js 14, TypeScript, Tailwind CSS, and D3.

## Features

- ✅ 22-week structured study plan across 5 phases
- 🔥 Daily streak tracking with activity heatmap
- 📋 Task status cycling: Todo → In Progress → Done
- 🌿 Interactive knowledge dependency graph (D3)
- 💾 All progress saved to localStorage (no backend needed)
- 📝 Per-week notes
- 🎨 Dark academic aesthetic

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# 3. Open http://localhost:3000
```

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B — GitHub + Vercel dashboard
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Vercel auto-detects Next.js — just click Deploy
4. Done. Your URL will be `https://your-project.vercel.app`

## Project Structure

```
emai-prep/
├── app/
│   ├── layout.tsx        # Root layout, fonts
│   ├── page.tsx          # Entry point
│   └── globals.css       # Global styles + animations
├── components/
│   ├── Dashboard.tsx     # Main orchestrator, tab routing
│   ├── StreakBar.tsx      # Streak counter + activity heatmap
│   ├── PhaseSection.tsx  # Collapsible phase with week list
│   ├── WeekPanel.tsx     # Collapsible week with tasks + notes
│   ├── TaskCard.tsx      # Individual task with status cycling
│   └── KnowledgeTree.tsx # D3 dependency graph
├── lib/
│   ├── data.ts           # All curriculum data (weeks, tasks, nodes)
│   └── store.ts          # localStorage hook + derived state
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.mjs
└── vercel.json
```

## Customising

### Adding or editing tasks
Edit `lib/data.ts` — the `WEEKS` array. Each task has:
```ts
{ id: string, text: string, type: "read" | "code" | "check" | "watch" | "install" }
```

### Adding knowledge nodes
Edit the `KNOWLEDGE_NODES` array in `lib/data.ts`. Set `dependsOn` to the IDs of prerequisite nodes, and `weekIds` to the weeks that contribute to this node.

### Changing the colour scheme
Edit `tailwind.config.js` and `app/globals.css`. Phase accent colours are set per-phase in the `PHASES` array in `lib/data.ts`.
