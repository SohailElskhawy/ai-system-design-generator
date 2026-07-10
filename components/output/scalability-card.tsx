import React, { useState } from "react";
import { Activity, Zap, TrendingUp } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface ScalabilityCardProps {
  scalability: string[];
}

export default function ScalabilityCard({ scalability }: ScalabilityCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    const text = scalability.map(s => `- ${s}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="scalability"
        title="Scalability Recommendations"
        icon={<Activity className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-5">
          <div className="rounded-lg bg-zinc-950 border border-zinc-900 p-4 flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-zinc-300 block mb-0.5">Scaling Strategy</span>
              <p className="text-zinc-400">
                These design parameters are structured to support high concurrent workloads, preventing resource exhaustion at the compute or storage layers.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {scalability.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 text-xs"
              >
                <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-indigo-900 bg-indigo-950/40 text-indigo-400">
                  <Zap className="h-2.5 w-2.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-zinc-300">
                    {item.split(":")[0]}
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    {item.split(":")[1]?.trim() || item}
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
