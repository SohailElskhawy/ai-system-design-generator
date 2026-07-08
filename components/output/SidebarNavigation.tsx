import React, { useEffect, useState } from "react";
import { 
  FileText, CheckSquare, Users, GitCommit, Layers, Database, 
  Code2, Network, Activity, ShieldAlert, Calendar 
} from "lucide-react";

interface SidebarNavigationProps {
  activeId: string;
  onNavigate: (id: string) => void;
  metadata: {
    complexity: string;
    readingTime: string;
  };
}

export default function SidebarNavigation({ activeId, onNavigate, metadata }: SidebarNavigationProps) {
  const sections = [
    { id: "summary", label: "Project Summary", icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "requirements", label: "Requirements", icon: <CheckSquare className="h-3.5 w-3.5" /> },
    { id: "actors", label: "System Actors", icon: <Users className="h-3.5 w-3.5" /> },
    { id: "usecases", label: "Use Case Flows", icon: <GitCommit className="h-3.5 w-3.5" /> },
    { id: "techstack", label: "Recommended Tech Stack", icon: <Layers className="h-3.5 w-3.5" /> },
    { id: "database", label: "Database Design", icon: <Database className="h-3.5 w-3.5" /> },
    { id: "api", label: "REST API Endpoints", icon: <Code2 className="h-3.5 w-3.5" /> },
    { id: "architecture", label: "System Architecture", icon: <Network className="h-3.5 w-3.5" /> },
    { id: "scalability", label: "Scalability Plan", icon: <Activity className="h-3.5 w-3.5" /> },
    { id: "security", label: "Security & Auditing", icon: <ShieldAlert className="h-3.5 w-3.5" /> },
    { id: "roadmap", label: "Phased Roadmap", icon: <Calendar className="h-3.5 w-3.5" /> },
  ];

  return (
    <aside className="sticky top-20 hidden w-64 shrink-0 lg:block">
      <div className="space-y-6">
        {/* Quick Stats Header */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            System Specs
          </h4>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Complexity</span>
              <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                metadata.complexity === "Very High" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                metadata.complexity === "High" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {metadata.complexity}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Reading Time</span>
              <span className="font-medium text-zinc-300">{metadata.readingTime}</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-0.5" aria-label="Table of Contents">
          <span className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Sections
          </span>
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 border-l-2 border-indigo-500 pl-2.5"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                }`}
              >
                <span className={`${isActive ? "text-indigo-400" : "text-zinc-500"}`}>
                  {section.icon}
                </span>
                <span className="truncate">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
