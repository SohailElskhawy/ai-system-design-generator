import React, { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCopy?: () => void;
  id: string;
}

export default function SectionHeader({
  title,
  icon,
  isCollapsed,
  onToggleCollapse,
  onCopy,
  id,
}: SectionHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/40 px-4 py-3 cursor-pointer select-none"
      onClick={onToggleCollapse}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded border border-zinc-800 bg-zinc-950 text-indigo-400">
          {icon}
        </div>
        <h3 id={id} className="scroll-section text-sm font-semibold text-zinc-200">
          {title}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        {onCopy && (
          <button
            onClick={handleCopyClick}
            className="flex h-7 w-7 items-center justify-center rounded border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label={`Copy ${title} content`}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-all focus:outline-none"
          aria-label={isCollapsed ? "Expand card" : "Collapse card"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
