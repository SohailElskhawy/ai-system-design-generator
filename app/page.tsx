"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import PromptInput from "@/components/prompt-input";
import LoadingState from "@/components/loading";
import { generateMockArchitecture } from "@/lib/mock-data";
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

  // Handle generating action
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setState("LOADING");
    // Scroll smoothly to loading area
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Called when LoadingState timer completes
  const handleLoadingComplete = () => {
    const data = generateMockArchitecture(prompt);
    setOutput(data);
    setState("COMPLETED");
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
      <Navbar />

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

        {/* Input Interface */}
        <section className="max-w-3xl mx-auto w-full">
          <PromptInput 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onSubmit={handleGenerate} 
            loading={state === "LOADING"} 
          />
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
              <LoadingState onComplete={handleLoadingComplete} />
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
