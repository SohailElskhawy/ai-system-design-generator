import React, { useState } from "react";
import { 
  Network, Laptop, Globe, ArrowRight, ShieldCheck, 
  Cpu, HardDrive, Database, Zap 
} from "lucide-react";
import { SystemArchitecture } from "@/types";
import SectionHeader from "./SectionHeader";

interface ArchitectureCardProps {
  architecture: SystemArchitecture;
}

export default function ArchitectureCard({ architecture }: ArchitectureCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleCopy = () => {
    const text = `Architecture Type: ${architecture.type}\n\nData Flow:\n${architecture.diagramText}\n\nDescription: ${architecture.description}`;
    navigator.clipboard.writeText(text);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "client":
        return <Laptop className="h-5 w-5 text-indigo-400" />;
      case "network":
        return <Globe className="h-5 w-5 text-sky-400" />;
      case "compute":
        return <Cpu className="h-5 w-5 text-emerald-400" />;
      case "cache":
        return <Zap className="h-5 w-5 text-amber-400" />;
      case "database":
        return <Database className="h-5 w-5 text-purple-400" />;
      default:
        return <HardDrive className="h-5 w-5 text-zinc-400" />;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="architecture"
        title="System Architecture Diagram"
        icon={<Network className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Topology Model</span>
              <span className="text-indigo-400 font-semibold">{architecture.type}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {architecture.description}
            </p>
          </div>

          {/* Interactive Visual Network Topology Map */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 flex flex-col items-center justify-center gap-6 overflow-x-auto min-w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 font-mono">
              System Nodes Map (Click to Inspect)
            </span>
            
            <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center py-4">
              {architecture.nodes.map((node, idx) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <React.Fragment key={node.id}>
                    <button
                      onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                      className={`relative flex flex-col items-center gap-2 rounded-lg border p-3 min-w-[120px] transition-all cursor-pointer focus:outline-none ${
                        isSelected
                          ? "bg-indigo-950/30 border-indigo-500 text-zinc-100 shadow-md shadow-indigo-500/10 scale-105"
                          : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      {/* Node Glow Dot */}
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                        </span>
                      )}
                      
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 border border-zinc-800">
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="text-[10px] font-semibold text-center leading-tight">
                        {node.label.split(" (")[0]}
                      </span>
                    </button>

                    {/* Arrow between nodes */}
                    {idx < architecture.nodes.length - 1 && (
                      <div className="flex items-center text-zinc-700 mx-0.5" aria-hidden="true">
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Node Details Description Panel */}
          {selectedNodeId ? (
            <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/10 p-4 space-y-2 animate-fadeIn text-xs">
              {(() => {
                const node = architecture.nodes.find(n => n.id === selectedNodeId);
                const incoming = architecture.connections.filter(c => c.to === selectedNodeId);
                const outgoing = architecture.connections.filter(c => c.from === selectedNodeId);

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                      <h4 className="font-bold text-zinc-200 font-mono uppercase">
                        Node: {node?.label}
                      </h4>
                      <span className="text-[10px] font-mono text-indigo-400 capitalize">
                        Type: {node?.type}
                      </span>
                    </div>
                    
                    {incoming.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Incoming Traffic</span>
                        {incoming.map((inc, i) => (
                          <p key={i} className="text-zinc-400">
                            From <span className="font-semibold text-zinc-300">{architecture.nodes.find(n => n.id === inc.from)?.label.split(" (")[0]}</span> 
                            {inc.label ? ` via ${inc.label}` : ""}
                          </p>
                        ))}
                      </div>
                    )}

                    {outgoing.length > 0 && (
                      <div className="space-y-1 mt-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Outgoing Traffic</span>
                        {outgoing.map((out, i) => (
                          <p key={i} className="text-zinc-400">
                            To <span className="font-semibold text-zinc-300">{architecture.nodes.find(n => n.id === out.to)?.label.split(" (")[0]}</span> 
                            {out.label ? ` via ${out.label}` : ""}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-4 font-mono text-[10px] text-zinc-500">
              <span className="text-zinc-400 font-semibold block mb-1 uppercase tracking-wider">
                Full Sequence Blueprint Flow
              </span>
              <p className="leading-relaxed">
                {architecture.diagramText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
