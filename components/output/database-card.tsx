import React, { useState } from "react";
import { Database, Key, HelpCircle, AlertCircle } from "lucide-react";
import { DatabaseTable } from "@/types";
import SectionHeader from "./SectionHeader";

interface DatabaseCardProps {
  databaseDesign: DatabaseTable[];
}

export default function DatabaseCard({ databaseDesign }: DatabaseCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTableIdx, setActiveTableIdx] = useState(0);

  const handleCopy = () => {
    const text = databaseDesign
      .map(
        t =>
          `Table: ${t.tableName} (${t.description})\n` +
          `Fields:\n` +
          t.columns
            .map(c => `  - ${c.name} (${c.type})${c.key ? ` [${c.key}]` : ""}: ${c.description}`)
            .join("\n")
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
  };

  const currentTable = databaseDesign[activeTableIdx];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 transition-all hover:border-zinc-800/80">
      <SectionHeader
        id="database"
        title="Database Schema Design"
        icon={<Database className="h-4 w-4" />}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onCopy={handleCopy}
      />

      {!isCollapsed && (
        <div className="p-5 md:p-6 space-y-6">
          {/* Table Select Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-900 pb-3">
            {databaseDesign.map((table, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTableIdx(idx)}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold font-mono border transition-all cursor-pointer focus:outline-none ${
                  activeTableIdx === idx
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {table.tableName}
              </button>
            ))}
          </div>

          {currentTable && (
            <div className="space-y-4 animate-fadeIn">
              {/* Table Description */}
              <div className="rounded-md bg-zinc-950 border border-zinc-900 px-4 py-3 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-zinc-300 block mb-0.5">Table Description</span>
                  <p className="text-zinc-400">{currentTable.description}</p>
                </div>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto rounded-lg border border-zinc-900 bg-zinc-950">
                <table className="w-full border-collapse text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900/60 font-mono text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-900">
                    <tr>
                      <th className="px-4 py-3">Field</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Key</th>
                      <th className="px-4 py-3">Nullable</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-sans">
                    {currentTable.columns.map((col, colIdx) => (
                      <tr 
                        key={colIdx}
                        className="hover:bg-zinc-900/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-indigo-300">
                          {col.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-400">
                          {col.type}
                        </td>
                        <td className="px-4 py-3">
                          {col.key ? (
                            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold font-mono border ${
                              col.key === "PK" 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                            }`}>
                              <Key className="h-2.5 w-2.5" />
                              {col.key}
                            </span>
                          ) : (
                            <span className="text-zinc-600 font-mono">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-500">
                          {col.nullable ? "YES" : "NO"}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 leading-normal max-w-xs">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
