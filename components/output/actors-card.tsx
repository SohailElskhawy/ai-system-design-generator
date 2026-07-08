import React, { useState } from "react";
import { Users, User, ShieldAlert, Cpu } from "lucide-react";
import { Actor } from "@/types";
import SectionHeader from "./SectionHeader";

interface ActorsCardProps {
  actors: Actor[];
}

export default function ActorsCard({ actors }: ActorsCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    const text = actors.map(a => `${a.name} (${a.role}): ${a.description}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  const getActorIcon = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes("admin") || lowerRole.includes("security") || lowerRole.includes("operator")) {
      return <ShieldAlert className="h-4 w-4 text-amber-400" />;
    }
    if (lowerRole.includes("worker") || lowerRole.includes("process") || lowerRole.includes("system")) {
      return <Cpu className="h-4 w-4 text-emerald-400" />;
    }
    return <User className="h-4 w-4 text-indigo-400" />;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="actors"
        title="System Actors & Roles"
        icon={<Users className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {actors.map((actor, idx) => (
              <div 
                key={idx}
                className="rounded-lg border border-zinc-900 bg-zinc-950/60 p-4 space-y-2.5 transition-all hover:border-zinc-800/60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded border border-zinc-800 bg-zinc-900">
                    {getActorIcon(actor.role)}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/60">
                    {actor.role}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">
                    {actor.name}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                    {actor.description}
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
