"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import PromptInput from "@/components/prompt-input";
import LoadingState from "@/components/loading";
import { SystemArchitectureOutput } from "@/types";

// Import modular cards
import SummaryCard from "@/components/output/summary-card";
import RequirementCard from "@/components/output/requirement-card";
import ActorsCard from "@/components/output/actors-card";
import UseCasesCard from "@/components/output/usecases-card";
import TechStackCard from "@/components/output/tech-stack-card";
import DatabaseCard from "@/components/output/database-card";
import ApiCard from "@/components/output/api-card";
import ArchitectureCard from "@/components/output/architecture-card";
import ScalabilityCard from "@/components/output/scalability-card";
import SecurityCard from "@/components/output/security-card";
import RoadmapCard from "@/components/output/roadmap-card";
import SidebarNavigation from "@/components/output/SidebarNavigation";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<"EMPTY" | "LOADING" | "COMPLETED">("EMPTY");
  const [output, setOutput] = useState<SystemArchitectureOutput | null>(null);
  const [activeSection, setActiveSection] = useState("summary");

  // API Key (BYOK), error, and generation status states
  const [apiKey, setApiKey] = useState("");
  const [isApiComplete, setIsApiComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // References for cross-event synchronization between API promise and progress animation
  const apiDataRef = useRef<SystemArchitectureOutput | null>(null);
  const animationDoneRef = useRef(false);

  // Load API key from local storage on mount safely to avoid synchronous cascading renders
  useEffect(() => {
    const stored = localStorage.getItem("archai_gemini_api_key");
    if (stored) {
      setTimeout(() => {
        setApiKey(stored);
      }, 0);
    }
  }, []);

  const handleSetApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem("archai_gemini_api_key", val);
  };

  // Handle generating action
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setError(null);
    setOutput(null);
    setIsApiComplete(false);
    apiDataRef.current = null;
    animationDoneRef.current = false;
    setState("LOADING");

    // Scroll smoothly to loading area
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey.trim()) {
        headers["x-gemini-api-key"] = apiKey.trim();
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Generation failed: HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.systemDesign) {
        throw new Error("Invalid output received from the server.");
      }

      apiDataRef.current = data.systemDesign;
      setIsApiComplete(true);

      // If progress animation has already hit 100%, show results immediately
      if (animationDoneRef.current) {
        setOutput(data.systemDesign);
        setState("COMPLETED");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred while compiling your architecture.";
      console.error("[Generation API Error]:", err);
      setError(message);
      setState("EMPTY");
      setIsApiComplete(false);
    }
  };

  // Called when LoadingState timer completes
  const handleLoadingComplete = () => {
    animationDoneRef.current = true;
    if (apiDataRef.current) {
      setOutput(apiDataRef.current);
      setState("COMPLETED");
    }
  };

  // Convert the output JSON structure into a formatted Markdown document and trigger a browser download
  const handleExportMarkdown = () => {
    if (!output) return;

    let md = `# Architectural Blueprint: ${output.summary.title}\n\n`;
    md += `${output.summary.description}\n\n`;
    md += `## Metadata\n`;
    md += `- **Complexity**: ${output.summary.complexity}\n`;
    md += `- **Reading Time**: ${output.summary.readingTime}\n`;
    md += `- **Target Audience**: ${output.summary.targetAudience}\n`;
    md += `- **Estimated Infrastructure Cost**: ${output.summary.estimatedCost}\n`;
    md += `- **Primary Database Strategy**: ${output.summary.primaryDatabase}\n\n`;
    md += `---\n\n`;

    md += `## 1. Functional Requirements\n`;
    output.functionalRequirements.forEach((req) => {
      md += `- ${req}\n`;
    });
    md += `\n`;

    md += `## 2. Non-Functional Requirements\n`;
    output.nonFunctionalRequirements.forEach((req) => {
      md += `- ${req}\n`;
    });
    md += `\n`;

    md += `## 3. System Actors\n`;
    output.actors.forEach((actor) => {
      md += `- **${actor.name}** (${actor.role}): ${actor.description}\n`;
    });
    md += `\n`;

    md += `## 4. Use Case Flows\n`;
    output.useCases.forEach((uc) => {
      md += `- **Actor**: ${uc.actor}\n`;
      md += `  - **Action**: ${uc.action}\n`;
      md += `  - **Benefit**: ${uc.benefit}\n`;
    });
    md += `\n`;

    md += `## 5. Recommended Technology Stack\n`;
    output.techStack.forEach((cat) => {
      md += `### ${cat.category}\n`;
      cat.technologies.forEach((tech) => {
        md += `- **${tech.name}**: ${tech.reason}\n`;
      });
      md += `\n`;
    });

    md += `## 6. Database Schema Design\n`;
    output.databaseDesign.forEach((table) => {
      md += `### Table: ${table.tableName}\n`;
      md += `*${table.description}*\n\n`;
      md += `| Column | Type | Key | Nullable | Description |\n`;
      md += `| --- | --- | --- | --- | --- |\n`;
      table.columns.forEach((col) => {
        md += `| \`${col.name}\` | \`${col.type}\` | ${col.key || "-"} | ${col.nullable ? "YES" : "NO"} | ${col.description} |\n`;
      });
      md += `\n`;
    });

    md += `## 7. REST API Documentation\n`;
    output.apiEndpoints.forEach((api) => {
      md += `### \`${api.method} ${api.endpoint}\`\n`;
      md += `*${api.description}*\n\n`;
      if (api.requestBody) {
        md += `**Request Body**:\n\`\`\`json\n${api.requestBody}\n\`\`\`\n\n`;
      }
      if (api.responseBody) {
        md += `**Response Body**:\n\`\`\`json\n${api.responseBody}\n\`\`\`\n\n`;
      }
    });

    md += `## 8. System Architecture Diagram\n`;
    md += `- **Topology Model**: ${output.systemArchitecture.type}\n`;
    md += `- **Description**: ${output.systemArchitecture.description}\n\n`;
    md += `### Sequence Flow Topology\n`;
    md += `\`\`\`\n${output.systemArchitecture.diagramText}\n\`\`\`\n\n`;
    if (output.systemArchitecture.mermaidDiagram) {
      md += `### Mermaid Diagram\n`;
      md += `\`\`\`mermaid\n${output.systemArchitecture.mermaidDiagram}\n\`\`\`\n\n`;
    }

    md += `## 9. Scalability Strategy\n`;
    output.scalability.forEach((sc) => {
      md += `- ${sc}\n`;
    });
    md += `\n`;

    md += `## 10. Security & Auditing Controls\n`;
    output.security.forEach((sec) => {
      md += `### ${sec.category}\n`;
      sec.measures.forEach((m) => {
        md += `- ${m}\n`;
      });
      md += `\n`;
    });

    md += `## 11. Phased Development Roadmap\n`;
    output.roadmap.forEach((phase) => {
      md += `### ${phase.phase} (${phase.duration})\n`;
      phase.tasks.forEach((task) => {
        md += `- ${task}\n`;
      });
      md += `\n`;
    });

    // Create file and download
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedTitle = output.summary.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    link.setAttribute("download", `${sanitizedTitle}-blueprint.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Scroll to section handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for sticky header
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Scroll spy to highlight active section in Sidebar
  useEffect(() => {
    if (state !== "COMPLETED") return;

    const handleScroll = () => {
      const sectionIds = [
        "summary", "requirements", "actors", "usecases", 
        "techstack", "database", "api", "architecture", 
        "scalability", "security", "roadmap"
      ];
      
      const scrollPosition = window.scrollY + 120; // threshold offset

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" aria-hidden="true" />
      
      {/* Top Navbar */}
      <Navbar apiKey={apiKey} setApiKey={handleSetApiKey} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 z-10 space-y-10">
        
        {/* Hero Section */}
        <section id="hero" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/20 px-3 py-1 text-xs font-medium text-indigo-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse glow-dot" />
            <span>Interactive Architecture Generator</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-zinc-100">
            Design Systems at Scale
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
            Input your product vision and let the architect synthesize requirements, schemas, APIs, and dev timelines in seconds.
          </p>
        </section>

        {/* Input Interface & Error Banner */}
        <section className="max-w-3xl mx-auto w-full space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/25 bg-red-950/20 px-4 py-3 text-xs text-red-400 flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <p className="leading-relaxed font-sans">{error}</p>
              </div>
              <button 
                onClick={handleGenerate}
                className="rounded border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 font-semibold text-[10px] text-red-300 transition-colors shrink-0 cursor-pointer focus:outline-none"
              >
                Retry
              </button>
            </div>
          )}

          <PromptInput 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onSubmit={handleGenerate} 
            loading={state === "LOADING"} 
          />
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 pt-1">
            <Lock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>
              Your API Key is secure. It is saved only in your local browser and sent directly to Gemini via HTTPS. We never save or log your keys.
            </span>
          </div>
        </section>

        {/* Main Workspace Area */}
        <section className="w-full">
          {state === "EMPTY" && (
            <div className="max-w-3xl mx-auto w-full animate-fadeIn">
              <EmptyState />
            </div>
          )}

          {state === "LOADING" && (
            <div className="max-w-xl mx-auto w-full py-12">
              <LoadingState onComplete={handleLoadingComplete} isComplete={isApiComplete} />
            </div>
          )}

          {state === "COMPLETED" && output && (
            <div className="flex flex-col lg:flex-row gap-8 items-start w-full animate-slideUp">
              
              {/* Sticky Table of Contents Sidebar */}
              <SidebarNavigation 
                activeId={activeSection} 
                onNavigate={scrollToSection} 
                metadata={{
                  complexity: output.summary.complexity,
                  readingTime: output.summary.readingTime
                }}
                onExport={handleExportMarkdown}
              />

              {/* Scrolling Output Cards Stack */}
              <div className="flex-1 w-full space-y-8 max-w-4xl">
                
                {/* 1. Summary Card */}
                <div className="scroll-section">
                  <SummaryCard summary={output.summary} />
                </div>

                {/* 2. Requirements Card */}
                <div className="scroll-section">
                  <RequirementCard 
                    functional={output.functionalRequirements} 
                    nonFunctional={output.nonFunctionalRequirements} 
                  />
                </div>

                {/* 3. Actors Card */}
                <div className="scroll-section">
                  <ActorsCard actors={output.actors} />
                </div>

                {/* 4. Use Case Flows Card */}
                <div className="scroll-section">
                  <UseCasesCard useCases={output.useCases} />
                </div>

                {/* 5. Recommended Tech Stack Card */}
                <div className="scroll-section">
                  <TechStackCard techStack={output.techStack} />
                </div>

                {/* 6. Database Design Schema Card */}
                <div className="scroll-section">
                  <DatabaseCard databaseDesign={output.databaseDesign} />
                </div>

                {/* 7. REST API Documentation Card */}
                <div className="scroll-section">
                  <ApiCard apiEndpoints={output.apiEndpoints} />
                </div>

                {/* 8. System Architecture Diagram Card */}
                <div className="scroll-section">
                  <ArchitectureCard architecture={output.systemArchitecture} />
                </div>

                {/* 9. Scalability Recommendation Card */}
                <div className="scroll-section">
                  <ScalabilityCard scalability={output.scalability} />
                </div>

                {/* 10. Security & Auditing Controls Card */}
                <div className="scroll-section">
                  <SecurityCard security={output.security} />
                </div>

                {/* 11. Phased Roadmap Timeline Card */}
                <div className="scroll-section">
                  <RoadmapCard roadmap={output.roadmap} />
                </div>

              </div>
            </div>
          )}
        </section>
      </main>

      {/* Clean Engineering Footer */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-6 mt-16 z-10 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} ArchAI Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-zinc-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
