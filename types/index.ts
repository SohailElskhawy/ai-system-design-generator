export interface ProjectSummary {
  title: string;
  description: string;
  complexity: "Low" | "Medium" | "High" | "Very High";
  readingTime: string;
  targetAudience: string;
  estimatedCost: string;
  primaryDatabase: string;
}

export interface Actor {
  name: string;
  role: string;
  description: string;
}

export interface UseCase {
  actor: string;
  action: string;
  benefit: string;
}

export interface TechItem {
  name: string;
  reason: string;
}

export interface TechStackCategory {
  category: string;
  technologies: TechItem[];
}

export interface DatabaseColumn {
  name: string;
  type: string;
  key?: "PK" | "FK";
  nullable: boolean;
  description: string;
}

export interface DatabaseTable {
  tableName: string;
  description: string;
  columns: DatabaseColumn[];
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

export interface SystemArchitecture {
  type: string;
  diagramText: string;
  description: string;
  mermaidDiagram?: string;
  nodes: { id: string; label: string; type: "client" | "network" | "compute" | "cache" | "database" }[];
  connections: { from: string; to: string; label?: string }[];
}

export interface SecurityMeasure {
  category: string;
  measures: string[];
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  tasks: string[];
}

export interface SystemArchitectureOutput {
  summary: ProjectSummary;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  actors: Actor[];
  useCases: UseCase[];
  techStack: TechStackCategory[];
  databaseDesign: DatabaseTable[];
  apiEndpoints: ApiEndpoint[];
  systemArchitecture: SystemArchitecture;
  scalability: string[];
  security: SecurityMeasure[];
  roadmap: RoadmapPhase[];
}
