import { z } from "zod";

// Project summary details matching ProjectSummary interface
export const ProjectSummarySchema = z.object({
    title: z.string(),
    description: z.string(),
    complexity: z.enum(["Low", "Medium", "High", "Very High"]),
    readingTime: z.string(),
    targetAudience: z.string(),
    estimatedCost: z.string(),
    primaryDatabase: z.string(),
});

// Actor role definitions matching Actor interface
export const ActorSchema = z.object({
    name: z.string(),
    role: z.string(),
    description: z.string(),
});

// Use cases / flows matching UseCase interface
export const UseCaseSchema = z.object({
    actor: z.string(),
    action: z.string(),
    benefit: z.string(),
});

// Technology item within a tech stack category
export const TechItemSchema = z.object({
    name: z.string(),
    reason: z.string(),
});

// Tech stack categories (Frontend, Backend, Database, DevOps, etc.)
export const TechStackCategorySchema = z.object({
    category: z.string(),
    technologies: z.array(TechItemSchema),
});

// Database column schema
export const DatabaseColumnSchema = z.object({
    name: z.string(),
    type: z.string(),
    key: z.enum(["PK", "FK"]).optional(),
    nullable: z.boolean(),
    description: z.string(),
});

// Database table schema
export const DatabaseTableSchema = z.object({
    tableName: z.string(),
    description: z.string(),
    columns: z.array(DatabaseColumnSchema),
});

// REST API endpoint definition
export const ApiEndpointSchema = z.object({
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    endpoint: z.string(),
    description: z.string(),
    requestBody: z.string().optional(),
    responseBody: z.string().optional(),
});

// Node in the architecture diagram
export const ArchitectureNodeSchema = z.object({
    id: z.string(),
    label: z.string(),
    type: z.enum(["client", "network", "compute", "cache", "database"]),
});

// Connection in the architecture diagram
export const ArchitectureConnectionSchema = z.object({
    from: z.string(),
    to: z.string(),
    label: z.string().optional(),
});

// Full system topology diagram configuration
export const SystemArchitectureSchema = z.object({
    type: z.string(),
    diagramText: z.string(),
    description: z.string(),
    mermaidDiagram: z.string(),
    nodes: z.array(ArchitectureNodeSchema),
    connections: z.array(ArchitectureConnectionSchema),
});

// Security categories and their respective controls
export const SecurityMeasureSchema = z.object({
    category: z.string(),
    measures: z.array(z.string()),
});

// Phased roadmap milestones
export const RoadmapPhaseSchema = z.object({
    phase: z.string(),
    duration: z.string(),
    tasks: z.array(z.string()),
});

// Root System Design output schema, aligned with SystemArchitectureOutput
export const SystemDesignSchema = z.object({
    summary: ProjectSummarySchema,
    functionalRequirements: z.array(z.string()),
    nonFunctionalRequirements: z.array(z.string()),
    actors: z.array(ActorSchema),
    useCases: z.array(UseCaseSchema),
    techStack: z.array(TechStackCategorySchema),
    databaseDesign: z.array(DatabaseTableSchema),
    apiEndpoints: z.array(ApiEndpointSchema),
    systemArchitecture: SystemArchitectureSchema,
    scalability: z.array(z.string()),
    security: z.array(SecurityMeasureSchema),
    roadmap: z.array(RoadmapPhaseSchema),
});

export type SystemDesign = z.infer<typeof SystemDesignSchema>;