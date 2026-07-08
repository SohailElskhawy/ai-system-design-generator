import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, Lock, Check } from "lucide-react";
import { SecurityMeasure } from "@/types";
import SectionHeader from "./SectionHeader";

interface SecurityCardProps {
  security: SecurityMeasure[];
}

export default function SecurityCard({ security }: SecurityCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    const text = security
      .map(
        s =>
          `${s.category}:\n` +
          s.measures.map(m => `- ${m}`).join("\n")
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="security"
        title="Security & Auditing Controls"
        icon={<ShieldAlert className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-6">
          <div className="rounded-lg bg-zinc-950 border border-zinc-900 p-4 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-zinc-300 block mb-0.5">Threat Safeguards</span>
              <p className="text-zinc-400">
                Architectural hardeners designed to secure data integrity, authorize tenant boundaries, and provide compliance audit trails.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {security.map((sec, idx) => (
              <div 
                key={idx}
                className="rounded-lg border border-zinc-900 bg-zinc-950/60 p-4 space-y-3.5"
              >
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <Lock className="h-3.5 w-3.5 text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {sec.category}
                  </h4>
                </div>

                <ul className="space-y-3" role="list">
                  {sec.measures.map((measure, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-indigo-400">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </div>
                      <span className="text-zinc-400 leading-relaxed">
                        {measure}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
