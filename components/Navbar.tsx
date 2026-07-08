import React from "react";
import { Terminal, Cpu, ExternalLink } from "lucide-react";

// Inline SVG for GitHub to guarantee compatibility across bundler versions
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Product Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-indigo-400">
            <Cpu className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-base font-semibold tracking-tight text-zinc-100">
              ArchAI
            </span>
            <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-700/30">
              v1.0.0
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href="#hero" className="hover:text-zinc-100 transition-colors">
            Home
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-zinc-100 transition-colors">
            Docs <ExternalLink className="h-3 w-3" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-zinc-100 transition-colors">
            API <ExternalLink className="h-3 w-3" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-zinc-100 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-700"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
          <button
            disabled
            className="cursor-not-allowed rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-500 border border-zinc-700/50"
            aria-label="Export Blueprint (disabled)"
          >
            Deploy
          </button>
        </div>
      </div>
    </header>
  );
}
