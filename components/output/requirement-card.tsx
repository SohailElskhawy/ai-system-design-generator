import React, { useState } from "react";
import { CheckSquare, Check, ShieldCheck } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface RequirementCardProps {
  functional: string[];
  nonFunctional: string[];
}

export default function RequirementCard({ functional, nonFunctional }: RequirementCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    const text = `Functional Requirements:\n${functional.map(f => `- ${f}`).join("\n")}\n\nNon-Functional Requirements:\n${nonFunctional.map(n => `- ${n}`).join("\n")}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="requirements"
        title="Functional & Non-Functional Requirements"
        icon={<CheckSquare className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:divide-x md:divide-zinc-900">
          {/* Functional Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Functional Specs
              </h4>
            </div>
            <ul className="space-y-3" role="list">
              {functional.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-indigo-400">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="text-xs leading-relaxed text-zinc-300">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Non-Functional Requirements */}
          <div className="space-y-4 md:pl-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Non-Functional QoS
              </h4>
            </div>
            <ul className="space-y-3" role="list">
              {nonFunctional.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-emerald-400">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="text-xs leading-relaxed text-zinc-300">
                    {req}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
