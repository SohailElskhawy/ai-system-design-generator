import React, { useState } from "react";
import { FileText, Cpu, Clock, DollarSign, Database, Download, RotateCcw } from "lucide-react";
import { ProjectSummary } from "@/types";
import SectionHeader from "./SectionHeader";

interface SummaryCardProps {
  summary: ProjectSummary;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    const text = `${summary.title}\n\nDescription: ${summary.description}\nComplexity: ${summary.complexity}\nReading Time: ${summary.readingTime}\nTarget Audience: ${summary.targetAudience}\nEstimated Cloud Cost: ${summary.estimatedCost}\nPrimary Database: ${summary.primaryDatabase}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="summary"
        title="Project Summary"
        icon={<FileText className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
              {summary.title}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              {summary.description}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>Complexity</span>
              </div>
              <p className="text-sm font-semibold text-zinc-200">{summary.complexity}</p>
            </div>

            <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Reading Time</span>
              </div>
              <p className="text-sm font-semibold text-zinc-200">{summary.readingTime}</p>
            </div>

            <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <Database className="h-3.5 w-3.5 text-sky-400" />
                <span>Data Core</span>
              </div>
              <p className="text-sm font-semibold text-zinc-200 truncate" title={summary.primaryDatabase}>
                {summary.primaryDatabase.split(" ")[0]}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                <span>Cloud Budget</span>
              </div>
              <p className="text-sm font-semibold text-zinc-200 truncate" title={summary.estimatedCost}>
                {summary.estimatedCost.split(" ")[0]}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-zinc-900 pt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div>
              <span className="font-semibold text-zinc-400 block mb-1">Target Audience</span>
              <p className="text-zinc-500">{summary.targetAudience}</p>
            </div>
            <div>
              <span className="font-semibold text-zinc-400 block mb-1">Cost Estimations</span>
              <p className="text-zinc-500">{summary.estimatedCost}</p>
            </div>
          </div>

          {/* Action buttons (Disabled Placeholders) */}
          <div className="border-t border-zinc-900 pt-5 flex items-center justify-end gap-3 text-xs">
            <button
              disabled
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/30 px-3.5 py-2 font-medium text-zinc-500 cursor-not-allowed"
              title="Regenerate requires database link (placeholder)"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Regenerate (Disabled)</span>
            </button>
            <button
              disabled
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 border border-zinc-850 px-3.5 py-2 font-medium text-zinc-500 cursor-not-allowed"
              title="Export features coming soon (placeholder)"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF / MD</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
