import React, { useState } from "react";
import { Code2, ChevronRight, ChevronDown } from "lucide-react";
import { ApiEndpoint } from "@/types";
import SectionHeader from "./SectionHeader";

interface ApiCardProps {
  apiEndpoints: ApiEndpoint[];
}

export default function ApiCard({ apiEndpoints }: ApiCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<number, boolean>>({});

  const toggleEndpoint = (idx: number) => {
    setExpandedEndpoints(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleCopy = () => {
    const text = apiEndpoints
      .map(
        e =>
          `${e.method} ${e.endpoint}\nDescription: ${e.description}\n` +
          (e.requestBody ? `Request:\n${e.requestBody}\n` : "") +
          (e.responseBody ? `Response:\n${e.responseBody}\n` : "")
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  };

  const getMethodStyle = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "POST":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "PUT":
      case "PATCH":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "DELETE":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border border-zinc-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="api"
        title="REST API Documentation"
        icon={<Code2 className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-4">
          {apiEndpoints.map((endpoint, idx) => {
            const isExpanded = !!expandedEndpoints[idx];
            return (
              <div 
                key={idx}
                className="rounded-lg border border-zinc-900 bg-zinc-950/80 overflow-hidden"
              >
                {/* Endpoint Header Bar */}
                <div 
                  onClick={() => toggleEndpoint(idx)}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-900/30 transition-all select-none"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold font-mono ${getMethodStyle(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-200 break-all">
                      {endpoint.endpoint}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-500">
                    <span className="hidden sm:inline text-[11px] text-zinc-400 truncate max-w-xs md:max-w-md">
                      {endpoint.description}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {/* Expanded Payloads */}
                {isExpanded && (
                  <div className="border-t border-zinc-900 bg-zinc-950 p-4 space-y-4 animate-fadeIn">
                    {/* Inline Description (mobile safety) */}
                    <div className="sm:hidden text-xs text-zinc-400 leading-relaxed">
                      <span className="font-semibold text-zinc-300 block mb-0.5">Description</span>
                      {endpoint.description}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Request Body Schema */}
                      {endpoint.requestBody ? (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">
                            Request Body
                          </span>
                          <div className="relative rounded-md border border-zinc-900 bg-zinc-950/80 p-3.5 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                            <pre>{endpoint.requestBody}</pre>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">
                            Request Parameters
                          </span>
                          <div className="rounded-md border border-zinc-900 bg-zinc-950/80 p-3.5 font-mono text-[10px] text-zinc-600">
                            No request body payload required
                          </div>
                        </div>
                      )}

                      {/* Response Body Schema */}
                      {endpoint.responseBody && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">
                            Success Response (200 OK)
                          </span>
                          <div className="relative rounded-md border border-zinc-900 bg-zinc-950/80 p-3.5 font-mono text-[10px] text-indigo-300 overflow-x-auto">
                            <pre>{endpoint.responseBody}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
