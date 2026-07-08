import React, { useState } from "react";
import { Calendar, Clock, Milestone, Check } from "lucide-react";
import { RoadmapPhase } from "@/types";
import SectionHeader from "./SectionHeader";

interface RoadmapCardProps {
  roadmap: RoadmapPhase[];
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    const text = roadmap
      .map(
        r =>
          `${r.phase} (${r.duration})\n` +
          r.tasks.map(t => `- ${t}`).join("\n")
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="roadmap"
        title="Development Roadmap & Milestones"
        icon={<Calendar className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-6">
          <div className="relative border-l border-zinc-800 pl-6 ml-3 space-y-8">
            {roadmap.map((phase, idx) => (
              <div 
                key={idx}
                className="relative"
              >
                {/* Timeline Dot Indicator */}
                <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-indigo-500 bg-zinc-950 text-indigo-400">
                  <Milestone className="h-2 w-2" />
                </span>

                {/* Content block */}
                <div className="space-y-3">
                  {/* Phase Title & Duration */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-100 font-sans tracking-wide">
                      {phase.phase}
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                      <Clock className="h-3 w-3" />
                      {phase.duration}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <ul className="space-y-2.5 rounded-lg border border-zinc-900 bg-zinc-950/50 p-4" role="list">
                    {phase.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2.5 text-xs">
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-indigo-400">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </div>
                        <span className="text-zinc-400 leading-relaxed">
                          {task}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
