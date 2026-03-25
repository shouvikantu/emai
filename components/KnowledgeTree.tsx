"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { KNOWLEDGE_NODES, WEEKS, PHASES, KnowledgeNode } from "@/lib/data";

interface Props {
  getNodeCompletion: (weekIds: string[], allWeeks: typeof WEEKS) => number;
}

interface NodeDatum extends KnowledgeNode {
  x: number;
  y: number;
  completion: number;
  phaseAccent: string;
}

interface LinkDatum {
  source: NodeDatum;
  target: NodeDatum;
}

// Layout: manual tiers by dependency depth
function computeLayout(nodes: KnowledgeNode[]): Map<string, { x: number; y: number }> {
  // BFS to get tier depths
  const depth: Record<string, number> = {};
  const queue: string[] = [];

  for (const n of nodes) {
    if (n.dependsOn.length === 0) {
      depth[n.id] = 0;
      queue.push(n.id);
    }
  }

  while (queue.length) {
    const id = queue.shift()!;
    for (const n of nodes) {
      if (n.dependsOn.includes(id)) {
        depth[n.id] = Math.max(depth[n.id] ?? 0, (depth[id] ?? 0) + 1);
        queue.push(n.id);
      }
    }
  }

  // Group by tier
  const tiers: Record<number, string[]> = {};
  for (const n of nodes) {
    const d = depth[n.id] ?? 0;
    tiers[d] = [...(tiers[d] ?? []), n.id];
  }

  const W = 900;
  const TIER_H = 130;
  const positions = new Map<string, { x: number; y: number }>();

  const maxTier = Math.max(...Object.keys(tiers).map(Number));

  for (const [tier, ids] of Object.entries(tiers)) {
    const t = Number(tier);
    const y = 60 + t * TIER_H;
    const count = ids.length;
    const step = W / (count + 1);
    ids.forEach((id, i) => {
      positions.set(id, { x: step * (i + 1), y });
    });
  }

  return positions;
}

const PHASE_ACCENTS: Record<string, string> = Object.fromEntries(
  PHASES.map((p) => [p.id, p.accentHex])
);

export default function KnowledgeTree({ getNodeCompletion }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ node: NodeDatum; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const layout = computeLayout(KNOWLEDGE_NODES);
    const W = 900;
    const H = 700;

    const nodeDatums: NodeDatum[] = KNOWLEDGE_NODES.map((n) => {
      const pos = layout.get(n.id) ?? { x: 0, y: 0 };
      return {
        ...n,
        x: pos.x,
        y: pos.y,
        completion: getNodeCompletion(n.weekIds, WEEKS),
        phaseAccent: PHASE_ACCENTS[n.phaseId] ?? "#8a8da6",
      };
    });

    const nodeById = new Map(nodeDatums.map((n) => [n.id, n]));

    const links: LinkDatum[] = [];
    for (const n of nodeDatums) {
      for (const depId of n.dependsOn) {
        const source = nodeById.get(depId);
        if (source) links.push({ source, target: n });
      }
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${W} ${H}`)
      .attr("width", "100%")
      .attr("height", "100%");

    // Defs — glow filters + arrow markers
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrow marker
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 28)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#3d4060");

    // Grid background dots
    const dotSpacing = 45;
    for (let dx = dotSpacing; dx < W; dx += dotSpacing) {
      for (let dy = dotSpacing; dy < H; dy += dotSpacing) {
        svg.append("circle").attr("cx", dx).attr("cy", dy).attr("r", 1).attr("fill", "#1a1d2e");
      }
    }

    // Links
    const linkGroup = svg.append("g").attr("class", "links");
    linkGroup.selectAll("path")
      .data(links)
      .join("path")
      .attr("d", (d) => {
        const sx = d.source.x, sy = d.source.y;
        const tx = d.target.x, ty = d.target.y;
        const cx = (sx + tx) / 2;
        return `M${sx},${sy} C${cx},${sy} ${cx},${ty} ${tx},${ty}`;
      })
      .attr("fill", "none")
      .attr("stroke", (d) => {
        const srcComp = d.source.completion;
        return srcComp === 1 ? "#3d6050" : "#1e2235";
      })
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => d.source.completion === 1 ? "none" : "4 3")
      .attr("opacity", 0.7)
      .attr("marker-end", "url(#arrow)");

    // Node groups
    const nodeGroup = svg.append("g").attr("class", "nodes");
    const nodeGs = nodeGroup.selectAll("g")
      .data(nodeDatums)
      .join("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .attr("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).select("circle.bg")
          .transition().duration(150)
          .attr("r", 30);
        setTooltip({ node: d, x: d.x, y: d.y });
      })
      .on("mouseleave", function () {
        d3.select(this).select("circle.bg")
          .transition().duration(150)
          .attr("r", 24);
        setTooltip(null);
      });

    // Background circle
    nodeGs.append("circle")
      .attr("class", "bg")
      .attr("r", 24)
      .attr("fill", (d) => d.completion > 0 ? `${d.phaseAccent}18` : "#12141f")
      .attr("stroke", (d) => d.completion === 1 ? "#7eb89a" : d.phaseAccent)
      .attr("stroke-width", (d) => d.completion === 1 ? 2 : 1)
      .attr("stroke-opacity", (d) => d.completion === 1 ? 0.9 : 0.35)
      .attr("filter", (d) => d.completion === 1 ? "url(#glow)" : "none");

    // Completion arc
    nodeGs.each(function (d) {
      if (d.completion <= 0) return;
      const g = d3.select(this);
      const r = 24;
      const angle = d.completion * 2 * Math.PI;
      const x1 = r * Math.sin(0);
      const y1 = -r * Math.cos(0);
      const x2 = r * Math.sin(angle);
      const y2 = -r * Math.cos(angle);
      const largeArc = d.completion > 0.5 ? 1 : 0;

      if (d.completion === 1) return; // full circle handled by stroke

      g.append("path")
        .attr("d", `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`)
        .attr("fill", "none")
        .attr("stroke", d.phaseAccent)
        .attr("stroke-width", 2.5)
        .attr("stroke-linecap", "round")
        .attr("opacity", 0.8);
    });

    // Label — short (2 chars or emoji)
    nodeGs.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "11px")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("fill", (d) => d.completion === 1 ? "#7eb89a" : d.phaseAccent)
      .attr("font-weight", "600")
      .text((d) => d.completion === 1 ? "✓" : d.label.slice(0, 3));

    // Below label
    nodeGs.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "38px")
      .attr("font-size", "9px")
      .attr("font-family", "Lato, sans-serif")
      .attr("fill", "#5e6180")
      .text((d) => d.label.length > 12 ? d.label.slice(0, 11) + "…" : d.label);

  }, [getNodeCompletion]);

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="w-full" style={{ minHeight: 500 }} />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 pointer-events-none animate-fade-up"
          style={{
            left: `${(tooltip.x / 900) * 100}%`,
            top: `${(tooltip.y / 700) * 100}%`,
            transform: "translate(-50%, -130%)",
          }}
        >
          <div className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 shadow-xl text-center whitespace-nowrap">
            <p className="text-sm font-medium text-ink-100">{tooltip.node.label}</p>
            {tooltip.node.sublabel && (
              <p className="text-xs text-ink-400 mt-0.5">{tooltip.node.sublabel}</p>
            )}
            <div className="mt-1.5 flex items-center gap-2 justify-center">
              <div className="h-1.5 w-20 bg-ink-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${tooltip.node.completion * 100}%`,
                    background: tooltip.node.completion === 1 ? "#7eb89a" : tooltip.node.phaseAccent,
                  }}
                />
              </div>
              <span className="text-xs font-mono" style={{ color: tooltip.node.phaseAccent }}>
                {Math.round(tooltip.node.completion * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 px-2">
        {PHASES.map((p) => (
          <div key={p.id} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: p.accentHex }}
            />
            <span className="text-xs text-ink-500">{p.title}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-5 h-px bg-ink-700" style={{ borderTop: "2px dashed #3d4060" }} />
          <span className="text-xs text-ink-500">Locked</span>
          <div className="w-5 h-px ml-2" style={{ background: "#3d6050", height: "2px" }} />
          <span className="text-xs text-ink-500">Unlocked</span>
        </div>
      </div>
    </div>
  );
}
