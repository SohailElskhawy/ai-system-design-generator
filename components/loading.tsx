import React, { useEffect, useState } from "react";
import { Check, Cpu, Loader2 } from "lucide-react";

interface LoadingStateProps {
  onComplete: () => void;
  isComplete: boolean;
}

// Module-level static constants (resolves react-hooks/exhaustive-deps issues)
const STEPS = [
  { title: "Generating requirements...", subtext: "Compiling functional scope and system actors" },
  { title: "Designing database...", subtext: "Creating relational tables and indexing bounds" },
  { title: "Planning APIs...", subtext: "Configuring REST endpoints and schema payloads" },
  { title: "Thinking about scalability...", subtext: "Sizing caching layers and replicas" },
  { title: "Creating roadmap...", subtext: "Dividing milestones into weekly sprints" },
];

const LOG_MESSAGES = [
  "Analyzing prompt vocabulary...",
  "Extracting system domain model...",
  "Defining primary actors and personas...",
  "Validating requirements integrity...",
  "Drafting database tables...",
  "Enforcing primary and foreign key constraints...",
  "Generating SQL schemas...",
  "Mapping RESTful resources...",
  "Drafting request/response JSON contracts...",
  "Sizing Redis caching nodes...",
  "Calculating load balancer distributions...",
  "Validating security parameters...",
  "Structuring development roadmap milestones...",
  "Compiling system design specifications...",
];

export default function LoadingState({ onComplete, isComplete }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(["Initializing ArchAI core engine..."]);

  // Track latest isComplete state without resetting useEffect intervals
  const isCompleteRef = React.useRef(isComplete);
  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  useEffect(() => {
    // Progress bar speed
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95 && !isCompleteRef.current) {
          return 95; // Hold at 95% until Gemini is done
        }
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (isCompleteRef.current ? 5 : 1);
      });
    }, 50); // ~5 seconds base loading speed

    // Steps timing
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(stepInterval);
          return STEPS.length - 1;
        }
        return prev + 1;
      });
    }, 1000);

    // Logs timing
    const logInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * LOG_MESSAGES.length);
      setLogs((prev) => [...prev.slice(-4), LOG_MESSAGES[randomIndex]]);
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Set step and complete asynchronously to prevent synchronous cascading renders warning
      const timer = setTimeout(() => {
        setCurrentStep(STEPS.length); // Mark the final step checkmark active
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-indigo-400">
          <Cpu className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">Generating System Architecture</h3>
          <p className="text-xs text-zinc-500">ArchAI agent is drafting blueprints</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 space-y-1">
        <div className="flex justify-between text-xs font-mono text-zinc-500">
          <span>Analysis Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="mt-8 space-y-4">
        {STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div 
              key={index}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                isDone ? "opacity-100" : isActive ? "opacity-100" : "opacity-40"
              }`}
            >
              <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                isDone 
                  ? "bg-indigo-600 border-indigo-500 text-white" 
                  : isActive 
                    ? "border-indigo-400 text-indigo-400 bg-indigo-950/20" 
                    : "border-zinc-800 text-zinc-500 bg-zinc-900/30"
              }`}>
                {isDone ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : isActive ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className={`text-xs font-semibold ${isActive ? "text-zinc-100" : "text-zinc-300"}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-zinc-500">
                  {step.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal logs block */}
      <div className="mt-8 rounded-lg border border-zinc-900 bg-zinc-950 p-4 font-mono text-[10px] text-zinc-500">
        <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2 text-[9px] uppercase tracking-wider font-semibold text-zinc-600">
          <span className="h-2 w-2 rounded-full bg-red-500/50" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/50" />
          <span className="h-2 w-2 rounded-full bg-green-500/50" />
          <span className="ml-1">System Terminal Logs</span>
        </div>
        <div className="mt-3.5 space-y-1 text-left min-h-18.75">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-1.5">
              <span className="text-zinc-700 select-none">&gt;</span>
              <span className={index === logs.length - 1 ? "text-zinc-400" : "text-zinc-600"}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
