import React, { useRef } from "react";
import { Sparkles, CornerDownLeft } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function PromptInput({ prompt, setPrompt, onSubmit, loading }: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const examples = [
    { label: "Build an AI Interview Platform", value: "Build an AI Interview Platform" },
    { label: "Build Uber", value: "Build Uber ride-sharing and dispatch architecture" },
    { label: "Build Airbnb", value: "Build Airbnb vacation rental search and calendar blocking system" },
    { label: "Inventory Management System", value: "Build an Inventory Management System with barcode scanning" },
    { label: "Hospital Management System", value: "Build a secure HIPAA-compliant Hospital Management System" },
    { label: "CRM Platform", value: "Build a multi-tenant CRM Platform for enterprise sales teams" },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (prompt.trim() && !loading) {
        onSubmit();
      }
    }
  };

  const handleExampleClick = (val: string) => {
    setPrompt(val);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Input container */}
      <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-3 transition-all focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/30">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the application architecture you want to design... (e.g. 'A real-time delivery system' or 'A SaaS payment portal')"
          rows={3}
          disabled={loading}
          className="w-full resize-none bg-transparent pr-12 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-0 focus:outline-none"
        />

        {/* Footer actions inside input container */}
        <div className="mt-3 flex items-center justify-between border-t border-zinc-900 pt-2.5 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline">Press</span>
            <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              Ctrl + Enter
            </kbd>
            <span className="hidden sm:inline">to generate</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 font-mono">
              {prompt.length} chars
            </span>
            <button
              onClick={onSubmit}
              disabled={!prompt.trim() || loading}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                prompt.trim() && !loading
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-600/10"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/30"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Blueprint</span>
              <CornerDownLeft className="h-3 w-3 opacity-60" />
            </button>
          </div>
        </div>
      </div>

      {/* Examples underneath */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          Example Prompts
        </span>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(example.value)}
              disabled={loading}
              className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3.5 py-1 text-xs text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-700"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
