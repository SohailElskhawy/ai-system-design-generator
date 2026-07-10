import React from "react";
import { Database, Network, Code, Milestone, Settings, Lock } from "lucide-react";

export default function EmptyState() {
  const features = [
    {
      icon: <Database className="h-4 w-4 text-indigo-400" />,
      title: "Database Relational Schemas",
      desc: "Get relational table layouts, primary/foreign key relations, and field definitions designed for your load pattern.",
    },
    {
      icon: <Code className="h-4 w-4 text-emerald-400" />,
      title: "RESTful API Blueprinting",
      desc: "API endpoints complete with HTTP verbs, JSON request payloads, and structural response examples.",
    },
    {
      icon: <Network className="h-4 w-4 text-sky-400" />,
      title: "System Architecture Diagrams",
      desc: "Detailed topologies tracing traffic from clients through CDNs, load balancers, application caches, and DB read replicas.",
    },
    {
      icon: <Milestone className="h-4 w-4 text-amber-400" />,
      title: "Development Milestones",
      desc: "A phased dev roadmap mapping week-by-week actions, deployment targets, and validation checkpoints.",
    },
  ];

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-8 text-center grid-bg">
      <div className="mx-auto max-w-2xl">
        {/* Technical Schematic Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-indigo-400/80 shadow-inner">
          <Settings className="h-5 w-5 animate-spin-slow text-indigo-400" style={{ animationDuration: '8s' }} />
        </div>
        
        <h2 className="mt-4 font-sans text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
          AI-Powered Software Architecture
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {"Describe the application you intend to build (e.g. \"A booking site like Airbnb\" or \"An inventory pipeline\"). ArchAI will draft full specification blueprints across multiple layers."}
        </p>

        {/* Blueprint Specs Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 transition-all hover:border-zinc-700/60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded border border-zinc-800 bg-zinc-900">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-zinc-50 transition-colors">
                  {f.title}
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Prompt Cue Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Lock className="h-3.5 w-3.5 text-indigo-400" />
          <span>Your API keys are completely secure. They are stored only in your local browser (localStorage) and never saved or logged on the server.</span>
        </div>
      </div>
    </div>
  );
}
