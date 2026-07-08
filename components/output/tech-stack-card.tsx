import React, { useState } from "react";
import { Layers, HelpCircle, Check } from "lucide-react";
import { TechStackCategory } from "@/types";
import SectionHeader from "./SectionHeader";

interface TechStackCardProps {
  techStack: TechStackCategory[];
}

export default function TechStackCard({ techStack }: TechStackCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeReason, setActiveReason] = useState<{ catIdx: number; techIdx: number } | null>(null);

  const handleCopy = () => {
    const text = techStack
      .map(
        c =>
          `${c.category}:\n` +
          c.technologies.map(t => `- ${t.name}: ${t.reason}`).join("\n")
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="techstack"
        title="Recommended Technology Stack"
        icon={<Layers className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {techStack.map((category, catIdx) => (
              <div 
                key={catIdx}
                className="rounded-lg border border-zinc-900 bg-zinc-950/60 p-4 space-y-3.5"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-900 pb-2">
                  {category.category}
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech, techIdx) => {
                    const isSelected = activeReason?.catIdx === catIdx && activeReason?.techIdx === techIdx;
                    return (
                      <button
                        key={techIdx}
                        onClick={() => {
                          if (isSelected) {
                            setActiveReason(null);
                          } else {
                            setActiveReason({ catIdx, techIdx });
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border transition-all cursor-pointer focus:outline-none ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/20"
                            : "bg-zinc-900 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        <span>{tech.name}</span>
                        <HelpCircle className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-zinc-500"}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Explanatory popup box for selected tech rationale */}
                {activeReason?.catIdx === catIdx && (
                  <div className="mt-3.5 rounded border border-indigo-900/50 bg-indigo-950/10 p-3 text-xs leading-relaxed text-zinc-300 animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-400 mb-1">
                      <Check className="h-3.5 w-3.5" />
                      <span>{category.technologies[activeReason.techIdx].name} Rationale</span>
                    </div>
                    {category.technologies[activeReason.techIdx].reason}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500 text-center">
            Tip: Click on any technology badge to reveal the implementation rationale.
          </p>
        </div>
      )}
    </div>
  );
}
