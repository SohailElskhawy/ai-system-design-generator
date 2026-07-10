"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid once client-side with premium dark mode theme configurations
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "strict",
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
    flowchart: {
      htmlLabels: true,
      curve: "basis", // smooth curved connection lines
    },
    themeVariables: {
      background: "#09090b", // zinc-950
      primaryColor: "#1e1b4b", // indigo-900 / 950
      primaryTextColor: "#f4f4f5", // zinc-100
      primaryBorderColor: "#4f46e5", // indigo-600 border glow
      lineColor: "#818cf8", // indigo-400 lines & arrows
      secondaryColor: "#18181b", // zinc-900
      tertiaryColor: "#09090b",
      mainBkg: "#09090b",
      nodeBorder: "#27272a", // zinc-800
      clusterBkg: "#09090b",
      clusterBorder: "#27272a",
    }
  });
}

export default function MermaidRenderer({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const renderChart = async () => {
      if (!chart) return;
      try {
        setError(null);
        // Create a unique container ID to avoid colliding rendering sessions
        const id = `mermaid-canvas-${Math.floor(Math.random() * 1000000)}`;
        
        // Render diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error("[Mermaid Render error]:", err);
        if (isMounted) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message || "Mermaid flowchart syntax is invalid.");
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/25 bg-red-950/20 p-4 font-mono text-[10px] text-red-400 max-w-full overflow-x-auto text-left">
        <p className="font-semibold uppercase tracking-wider text-xs mb-1">Mermaid Schematic Render Error</p>
        <p className="text-[10px] text-red-500/80 mb-2 leading-relaxed">{error}</p>
        <span className="text-zinc-500 block mb-1 uppercase tracking-wider text-[9px] font-bold">Source Code</span>
        <pre className="text-[10px] bg-zinc-950/60 p-3 rounded border border-zinc-900 overflow-x-auto text-zinc-400">
          {chart}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-3 w-full min-h-[150px]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider animate-pulse">
          Synthesizing SVG Topology...
        </span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full flex justify-center bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-xl overflow-x-auto select-none"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
