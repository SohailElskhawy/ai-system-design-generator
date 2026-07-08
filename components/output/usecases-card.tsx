import React, { useState } from "react";
import { GitCommit, ArrowRight, Activity } from "lucide-react";
import { UseCase } from "@/types";
import SectionHeader from "./SectionHeader";

interface UseCasesCardProps {
  useCases: UseCase[];
}

export default function UseCasesCard({ useCases }: UseCasesCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    const text = useCases.map(u => `Actor: ${u.actor}\nAction: ${u.action}\nValue: ${u.benefit}`).join("\n\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="usecases"
        title="Use Case Interactions"
        icon={<GitCommit className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6">
          <div className="space-y-4">
            {useCases.map((useCase, idx) => (
              <div 
                key={idx}
                className="flex flex-col md:flex-row md:items-center gap-4 rounded-lg border border-zinc-900 bg-zinc-950/40 p-4 transition-all hover:bg-zinc-950/60"
              >
                {/* Actor Info */}
                <div className="md:w-1/4 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                    Initiator
                  </span>
                  <h4 className="text-xs font-semibold text-zinc-200 mt-0.5">
                    {useCase.actor}
                  </h4>
                </div>

                {/* Flow indicator */}
                <div className="hidden md:block text-zinc-700">
                  <ArrowRight className="h-4 w-4" />
                </div>

                {/* Action details */}
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">
                    Core Action
                  </span>
                  <p className="text-xs text-zinc-300">
                    {useCase.action}
                  </p>
                </div>

                {/* Flow indicator */}
                <div className="hidden md:block text-zinc-700">
                  <ArrowRight className="h-4 w-4" />
                </div>

                {/* Business Value */}
                <div className="md:w-1/3 space-y-1 bg-zinc-900/50 md:bg-transparent p-2.5 md:p-0 rounded border border-zinc-900 md:border-none">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-3 w-3 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      Outcome Value
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {useCase.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
