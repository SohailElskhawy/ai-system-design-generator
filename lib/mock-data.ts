import { SystemArchitectureOutput, SystemArchitecture } from "@/types";

// Helper to generate a generic fallback system design
export function generateDynamicFallback(prompt: string): SystemArchitectureOutput {
  const cleanPrompt = prompt.trim();
  const title = cleanPrompt.length > 40 ? cleanPrompt.substring(0, 40) + "..." : cleanPrompt;
  const keywords = cleanPrompt.toLowerCase().split(/\s+/);
  
  // Try to determine the domain
  let dbStrategy = "PostgreSQL (Relational)";
  let cacheStrategy = "Redis (Session & Cache)";
  let primaryTech = "Next.js 15, Node.js, Express, PostgreSQL, Redis, Docker";
  
  if (keywords.includes("chat") || keywords.includes("messaging") || keywords.includes("realtime")) {
    primaryTech = "Next.js 15, FastAPI, Socket.io, PostgreSQL, Redis, Tailwind CSS";
    dbStrategy = "PostgreSQL (User details) + MongoDB (Chat history)";
  } else if (keywords.includes("ecommerce") || keywords.includes("shop") || keywords.includes("stripe")) {
    primaryTech = "Next.js 15, NestJS, PostgreSQL, Redis, Stripe, Elasticsearch";
    dbStrategy = "PostgreSQL (Transactions & Orders) + DynamoDB (Product Catalog)";
  } else if (keywords.includes("analytics") || keywords.includes("dashboard") || keywords.includes("data")) {
    primaryTech = "Next.js 15, Python (FastAPI), ClickHouse, PostgreSQL, Apache Kafka";
    dbStrategy = "ClickHouse (Time-series Events) + PostgreSQL (Metadata)";
  }

  return {
    summary: {
      title: `Architectural Blueprint for ${title}`,
      description: `A highly scalable, production-ready system architecture designed for "${cleanPrompt}". The system leverages a microservices-based approach with decoupled data ingestion, containerized hosting, and an optimized caching layer to handle high concurrent traffic.`,
      complexity: keywords.includes("enterprise") || keywords.includes("scale") ? "Very High" : "High",
      readingTime: "4 min read",
      targetAudience: "Technical Leads, Backend Engineers, DevOps Engineers",
      estimatedCost: "$150 - $450 / month (Initial scaling setup on AWS/GCP)",
      primaryDatabase: dbStrategy,
    },
    functionalRequirements: [
      "User authentication, role-based access control, and profile management.",
      "Core business workflows specific to the application context.",
      "Real-time alerts, events trigger, and notification system (Email, SMS, In-app).",
      "Interactive data dashboard with filtering, search, and CSV/PDF export.",
      "Audit logging of critical user transactions and administrative actions."
    ],
    nonFunctionalRequirements: [
      "Latency: API response time under 200ms for p95 requests.",
      "Availability: 99.9% uptime SLA using multi-AZ deployments.",
      "Scalability: Support up to 10,000 concurrent active connections.",
      "Security: Encryption at rest (AES-256) and in transit (TLS 1.3).",
      "Disaster Recovery: Automated daily database backups with 30-day retention."
    ],
    actors: [
      {
        name: "Standard User",
        role: "Client Consumer",
        description: "Primary consumer of the app interface who performs core interactions."
      },
      {
        name: "Administrator",
        role: "Operator",
        description: "Manages system configurations, audits activity logs, and moderates content."
      },
      {
        name: "Automated System Worker",
        role: "System Process",
        description: "Handles asynchronous background workers, reports, and cron cleanup tasks."
      }
    ],
    useCases: [
      {
        actor: "Standard User",
        action: "Performs primary operational task and receives immediate websocket update.",
        benefit: "Ensures responsive user feedback loop and low-latency interaction."
      },
      {
        actor: "Administrator",
        action: "Views system health dashboards and checks audit trails.",
        benefit: "Maintains operational safety and meets regulatory compliance goals."
      },
      {
        actor: "Automated System Worker",
        action: "Processes queue backlogs and sends push notifications.",
        benefit: "Decouples heavy compute from the web server, ensuring fluid user experience."
      }
    ],
    techStack: [
      {
        category: "Frontend Layer",
        technologies: [
          { name: "Next.js 15", reason: "React framework supporting Server Actions, Server Components, and optimized SEO out-of-the-box." },
          { name: "Tailwind CSS", reason: "Utility-first styling system to maintain high-performance, minimal visual layout." }
        ]
      },
      {
        category: "Backend Services",
        technologies: [
          { name: "Node.js / Express", reason: "Lightweight asynchronous runtime to handle concurrent REST API requests." },
          { name: "Docker", reason: "Ensures containerized reproducibility and ease of deployment across staging/production." }
        ]
      },
      {
        category: "Data & Storage",
        technologies: [
          { name: dbStrategy.split(" ")[0], reason: "Primary data storage matching the transactional and structured needs." },
          { name: "Redis", reason: "Fast in-memory storage for user session caching and distributed rate limiting." }
        ]
      },
      {
        category: "DevOps & Cloud",
        technologies: [
          { name: "AWS ECS / Fargate", reason: "Serverless container orchestration for cost-effective deployment and auto-scaling." },
          { name: "GitHub Actions", reason: "CI/CD automation for unit testing, linting, and zero-downtime deployment." }
        ]
      }
    ],
    databaseDesign: [
      {
        tableName: "users",
        description: "Stores primary credentials, registration metadata, and OAuth tokens.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique identifier for the user record." },
          { name: "email", type: "VARCHAR(255)", nullable: false, description: "User's email address, indexed for speed." },
          { name: "password_hash", type: "VARCHAR(255)", nullable: false, description: "Securely salted password digest." },
          { name: "role", type: "VARCHAR(50)", nullable: false, description: "User permission level (admin, user, guest)." },
          { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Timestamp of registration." }
        ]
      },
      {
        tableName: "audit_logs",
        description: "Implements compliance trails by recording system-wide administrative actions.",
        columns: [
          { name: "id", type: "BIGINT", key: "PK", nullable: false, description: "Sequential primary key." },
          { name: "user_id", type: "UUID", key: "FK", nullable: false, description: "Foreign key referencing users(id)." },
          { name: "action_type", type: "VARCHAR(100)", nullable: false, description: "Description of action (e.g. USER_UPDATE)." },
          { name: "ip_address", type: "VARCHAR(45)", nullable: true, description: "IP address of the client device." },
          { name: "timestamp", type: "TIMESTAMP", nullable: false, description: "Time of log entry." }
        ]
      }
    ],
    apiEndpoints: [
      {
        method: "POST",
        endpoint: "/api/v1/auth/register",
        description: "Creates a new user profile and returns access tokens.",
        requestBody: '{\n  "email": "user@example.com",\n  "password": "strongpassword123"\n}',
        responseBody: '{\n  "status": "success",\n  "user": { "id": "uuid-8789-1234", "email": "user@example.com" },\n  "token": "jwt-token-xyz"\n}'
      },
      {
        method: "GET",
        endpoint: "/api/v1/resource",
        description: "Fetches lists of primary entities with cursor-based pagination.",
        responseBody: '{\n  "data": [],\n  "pagination": { "next_cursor": "eyJwYWdlIjoyfQ" }\n}'
      }
    ],
    systemArchitecture: {
      type: "Modern Microservices Architecture",
      diagramText: "Client App -> CDN -> Application Load Balancer -> Web App Server -> Redis Cache -> Primary Database",
      description: "A secure tier-based microservices setup where incoming traffic is intercepted by a CDN, filtered through a WAF, and distributed across autoscaling web servers backed by a Redis caching tier and a primary replicated database cluster.",
      nodes: [
        { id: "client", label: "Client Browser / Mobile App", type: "client" },
        { id: "cdn", label: "Cloudflare CDN / WAF", type: "network" },
        { id: "alb", label: "AWS Application Load Balancer", type: "network" },
        { id: "app", label: "Application API (Docker/Node.js)", type: "compute" },
        { id: "redis", label: "Redis Caching Layer", type: "cache" },
        { id: "db", label: "PostgreSQL Database (Primary)", type: "database" }
      ],
      connections: [
        { from: "client", to: "cdn", label: "HTTPS / TLS 1.3" },
        { from: "cdn", to: "alb", label: "Forward request" },
        { from: "alb", to: "app", label: "Load balanced routing" },
        { from: "app", to: "redis", label: "Read session/caching" },
        { from: "app", to: "db", label: "Relational queries" }
      ]
    },
    scalability: [
      "Horizontal Scaling: Configure AWS ECS Auto-Scaling Policies targeting CPU utilization at 70%.",
      "Read Replicas: Provision secondary read-only database nodes to offload complex read queries from the primary node.",
      "CDN Edge Caching: Cache static assets and public APIs at edge locations to minimize server requests."
    ],
    security: [
      {
        category: "Network & Infrastructure",
        measures: [
          "Place all database instances inside a private subnet (VPC) blockading public internet routing.",
          "Restrict ingress security groups on servers to only accept traffic originating from the Load Balancer."
        ]
      },
      {
        category: "Data Integrity",
        measures: [
          "Enforce JSON Schema validations on all inbound API payloads to protect against SQL injections.",
          "Utilize bcrypt with a work factor of 12 for password hashing, and rotate keys quarterly."
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: MVP Core Development",
        duration: "Weeks 1 - 4",
        tasks: [
          "Setup PostgreSQL repository schemas and construct core Docker environments.",
          "Implement User Signup, Login, and basic JWT validation middleware.",
          "Deploy initial staging backend to AWS using automated GitHub Actions CI pipelines."
        ]
      },
      {
        phase: "Phase 2: Business Logic & APIs",
        duration: "Weeks 5 - 8",
        tasks: [
          "Complete frontend page routes, forms, and client dashboard UI integration.",
          "Construct main app APIs, pagination features, and hook up Redis query caching.",
          "Conduct extensive unit testing (aiming for >80% code coverage)."
        ]
      },
      {
        phase: "Phase 3: Security & Polish",
        duration: "Weeks 9 - 12",
        tasks: [
          "Integrate payment/notification third-party gateways (Stripe, Twilio).",
          "Apply security hardeners: setup secure HTTPS headers, rate limit endpoints.",
          "Run performance load testing under simulated stress configurations."
        ]
      }
    ]
  };
}

export const MOCK_ARCHITECTURES: Record<string, SystemArchitectureOutput> = {
  "ai-interview-platform": {
    summary: {
      title: "AI Interview Platform Architecture",
      description: "An enterprise-grade, automated candidate screening platform. Candidates complete asynchronous video interviews, which are processed by AI models to evaluate technical proficiency, communication skills, and behavioral traits. The architecture supports high-throughput video ingestion, asynchronous queue processing, and secure analytics dashboards for recruiters.",
      complexity: "Very High",
      readingTime: "5 min read",
      targetAudience: "CTOs, Technical Recruiter Leads, Frontend & Backend Engineers",
      estimatedCost: "$350 - $900 / month (dependent on AI API usage and video storage)",
      primaryDatabase: "PostgreSQL (Transactional) + MongoDB (Metadata & AI Scoring Reports)"
    },
    functionalRequirements: [
      "Recruiters can create job listings and define interview questionnaires.",
      "Candidates can perform system test checks (camera/microphone validation) and record video responses.",
      "AI engine automatically transcribes audio, evaluates sentiment, and grades coding answers.",
      "Recruiters receive a sorted dashboard ranking candidates by scores with transcript search features.",
      "Automated email notifications trigger upon invite, completion, and scoring completion."
    ],
    nonFunctionalRequirements: [
      "Video Ingestion: Handle parallel uploads of 100MB+ video files without API blocking.",
      "Processing Latency: Video scoring and report compilation completed within 5 minutes of upload.",
      "Security: Candidate data (PII, video streams) must be strictly isolated and encrypted.",
      "Scalability: Scaling compute to process up to 1,000 parallel video analyses concurrently."
    ],
    actors: [
      {
        name: "Candidate",
        role: "End User",
        description: "Logs in via secure single-use token, records video responses to questions."
      },
      {
        name: "Recruiter / Hiring Manager",
        role: "Enterprise Operator",
        description: "Creates job posts, reviews candidate report cards, watches highlight clips, sends offers."
      },
      {
        name: "AI Processor Worker",
        role: "Background Service",
        description: "Listens to video uploads, triggers transcription APIs, extracts sentiment, formats grades."
      }
    ],
    useCases: [
      {
        actor: "Candidate",
        action: "Submits video responses for a 5-question interview.",
        benefit: "Provides flexible, asynchronous interviewing experience from any device."
      },
      {
        actor: "AI Processor Worker",
        action: "Processes video using Gemini/Whisper, analyzes code snippets, and writes report.",
        benefit: "Offloads heavy ML pipelines from main web servers, preventing visual lag."
      },
      {
        actor: "Recruiter",
        action: "Filters and compares applicant ranks based on AI assessment scores.",
        benefit: "Saves up to 80% of manual screening hours by highlighting top fits."
      }
    ],
    techStack: [
      {
        category: "Frontend Layer",
        technologies: [
          { name: "Next.js 15 (App Router)", reason: "Enables fast SSR dashboards, static documentation pages, and server actions for state." },
          { name: "Tailwind CSS & shadcn/ui", reason: "Standardized developer styling, accessibility compliant UI components." },
          { name: "WebRTC", reason: "For real-time webcam testing and streaming telemetry prior to file uploading." }
        ]
      },
      {
        category: "API & Backend",
        technologies: [
          { name: "FastAPI (Python)", reason: "Extremely fast execution times, native async support, and rich library ecosytem for AI pipeline integrations." },
          { name: "Celery + RabbitMQ", reason: "Robust task queue system to manage asynchronous video transcription and scoring jobs." }
        ]
      },
      {
        category: "Data & Media Storage",
        technologies: [
          { name: "PostgreSQL", reason: "Ensures highly relational structure for users, companies, jobs, and candidate statuses." },
          { name: "MongoDB", reason: "Flexible document storage for saving raw transcripts, granular scoring JSON structures." },
          { name: "AWS S3 + CloudFront", reason: "Secure media storage for raw and trimmed interview clips, served securely with signed URLs." }
        ]
      },
      {
        category: "AI & Transcription",
        technologies: [
          { name: "Gemini 2.5 Flash", reason: "Large context window used to evaluate complete candidate transcripts against grading rubrics." },
          { name: "Whisper API", reason: "State of the art speech-to-text transcriber to turn voice recordings into text blocks." }
        ]
      }
    ],
    databaseDesign: [
      {
        tableName: "interviews",
        description: "Metadata tracking a candidate's session for a specific job.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique interview identifier." },
          { name: "candidate_name", type: "VARCHAR(150)", nullable: false, description: "Name of applicant." },
          { name: "email", type: "VARCHAR(255)", nullable: false, description: "Applicant contact email." },
          { name: "status", type: "VARCHAR(50)", nullable: false, description: "State of process (INVITED, RECORDING, COMPLETED, SCORED)." },
          { name: "job_id", type: "UUID", key: "FK", nullable: false, description: "Links to the jobs table." },
          { name: "overall_score", type: "INTEGER", nullable: true, description: "Normalized scoring calculated by AI (1-100)." }
        ]
      },
      {
        tableName: "video_responses",
        description: "Granular answers recorded by candidates for each interview question.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique response identifier." },
          { name: "interview_id", type: "UUID", key: "FK", nullable: false, description: "Linked parent interview session." },
          { name: "question_id", type: "UUID", nullable: false, description: "The specific question asked." },
          { name: "video_s3_url", type: "TEXT", nullable: false, description: "S3 path containing the uploaded video file." },
          { name: "transcript_text", type: "TEXT", nullable: true, description: "Whisper generated transcript text." },
          { name: "ai_score", type: "INTEGER", nullable: true, description: "Question-specific grade calculated by LLM." }
        ]
      }
    ],
    apiEndpoints: [
      {
        method: "GET",
        endpoint: "/api/v1/interviews/{interview_id}/session",
        description: "Fetches details of the interview session, active questions, and company configs. (Authorized via secure session token).",
        responseBody: '{\n  "interview_id": "9012-uuid-abc",\n  "candidate": "Alice Smith",\n  "questions": [\n    { "id": "q1", "text": "Describe a time you resolved a merge conflict." }\n  ],\n  "time_limit_secs": 180\n}'
      },
      {
        method: "POST",
        endpoint: "/api/v1/responses/upload",
        description: "Generates an S3 presigned POST URL enabling candidates to upload heavy video assets directly to cloud storage, bypassing API servers.",
        requestBody: '{\n  "interview_id": "9012-uuid-abc",\n  "question_id": "q1",\n  "file_extension": "webm"\n}',
        responseBody: '{\n  "s3_presigned_url": "https://s3.amazonaws.com/archai-media/...",\n  "fields": { "key": "uploads/q1.webm" }\n}'
      },
      {
        method: "POST",
        endpoint: "/api/v1/interviews/{interview_id}/complete",
        description: "Finalizes the candidate session and triggers the asynchronous AI analysis pipeline worker.",
        requestBody: '{}',
        responseBody: '{\n  "status": "queued",\n  "message": "AI analysis started. Recruiter will be notified."\n}'
      }
    ],
    systemArchitecture: {
      type: "Event-Driven Video Processing Architecture",
      diagramText: "Candidate Client -> CloudFront CDN -> Next.js Frontend -> S3 Bucket -> EventBridge -> Lambda AI Trigger -> SQS Queue -> FastAPI GPU Workers -> Postgres & MongoDB",
      description: "Candidates upload videos directly to an S3 bucket via presigned URLs. The upload triggers an S3 event that pushes to an SQS queue. Dedicated Python GPU worker nodes pull from the queue, execute speech-to-text, call LLM APIs for grading, and save structured reports into PostgreSQL and MongoDB.",
      nodes: [
        { id: "client", label: "Candidate UI (WebRTC / Upload)", type: "client" },
        { id: "s3", label: "AWS S3 Video Bucket", type: "database" },
        { id: "queue", label: "AWS SQS Task Queue", type: "network" },
        { id: "workers", label: "FastAPI GPU Workers (Python)", type: "compute" },
        { id: "gemini", label: "Gemini / Whisper APIs", type: "compute" },
        { id: "db_rel", label: "PostgreSQL (Users & Metadata)", type: "database" },
        { id: "db_doc", label: "MongoDB (Transcripts & Reports)", type: "database" }
      ],
      connections: [
        { from: "client", to: "s3", label: "Upload directly (Presigned URL)" },
        { from: "s3", to: "queue", label: "S3 ObjectCreated Event Notification" },
        { from: "queue", to: "workers", label: "Poll task messages" },
        { from: "workers", to: "gemini", label: "Audio extraction & prompt eval" },
        { from: "workers", to: "db_rel", label: "Update candidate status -> SCORED" },
        { from: "workers", to: "db_doc", label: "Insert structured JSON grading report" }
      ]
    },
    scalability: [
      "S3 Direct Upload: Prevents server bandwidth exhaustion during concurrent candidate uploads.",
      "Asynchronous Worker Scaling: Scale the consumer workers up/down based on the length of SQS queue queues.",
      "MongoDB Sharding: Shard candidate reports database by 'company_id' for linear performance growth."
    ],
    security: [
      {
        category: "Media Protection",
        measures: [
          "Secure S3 videos with private ACLs; views are strictly authorized via CloudFront presigned cookies expiring in 15 minutes.",
          "Watermark candidate videos dynamically during transit or review stages to prevent unauthorized sharing."
        ]
      },
      {
        category: "Compliance & PII",
        measures: [
          "GDPR and SOC2 compliance: Implement automatic data retention purge rules deleting video assets 180 days post-application.",
          "Mask all candidate names and photos during initial screening rounds for unbiased scoring."
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: Setup & Media Flow",
        duration: "Weeks 1 - 4",
        tasks: [
          "Configure AWS S3 bucket structures, lifecycle rules, and cors headers.",
          "Implement WebRTC microphone and webcam hardware test widgets in Next.js.",
          "Create endpoint for S3 presigned URL generation and test video file uploading."
        ]
      },
      {
        phase: "Phase 2: AI Pipeline & Queues",
        duration: "Weeks 5 - 8",
        tasks: [
          "Deploy FastAPI server integrated with RabbitMQ and Celery workers.",
          "Implement speech-to-text pipeline using Whisper and scoring template prompts using Gemini APIs.",
          "Setup MongoDB for storing multi-page transcript reports."
        ]
      },
      {
        phase: "Phase 3: Recruiters Dash & Release",
        duration: "Weeks 9 - 12",
        tasks: [
          "Construct the recruiter scoring dashboard with search filters, video players, and rating panels.",
          "Implement automated invite emails via Amazon SES.",
          "Conduct penetrative security audits on video viewing links."
        ]
      }
    ]
  },
  "build-uber": {
    summary: {
      title: "Ride-Sharing System Architecture (Uber)",
      description: "A highly resilient, real-time geolocation matching and ride-dispatching engine. The core system manages real-time updates of drivers via WebSockets/gRPC, executes geospatial searches using Redis GEO queries, matches riders with drivers using dynamic pricing, and processes high-scale transaction logs.",
      complexity: "Very High",
      readingTime: "6 min read",
      targetAudience: "Technical Architects, Backend Engineers, Geolocation experts",
      estimatedCost: "$500 - $1500 / month (depends on geolocation coordinate updates rate)",
      primaryDatabase: "Cassandra (Location history & trip events) + PostgreSQL (User profiles & Billing)"
    },
    functionalRequirements: [
      "Riders can request trips, select options (Standard, Premium), and see upfront fare estimates.",
      "Drivers receive dispatch notifications and accept/decline booking requests.",
      "Real-time GPS tracking displays driver vehicle moving live on the rider map.",
      "Automatic matching engine evaluates nearby online drivers in under 3 seconds.",
      "Cashless payments process automatically via Stripe at trip completion."
    ],
    nonFunctionalRequirements: [
      "Location Updates: Ingest driver location pings (every 4 seconds) with <200ms processing delay.",
      "Matching Rate: Support up to 50,000 matches per minute during peak times.",
      "High Availability: Zero dispatch downtime goal (Active-Active multi-region architecture).",
      "Consistent State: Guarantee single-driver ride dispatch lock using distributed locks."
    ],
    actors: [
      {
        name: "Rider",
        role: "Client",
        description: "Requests trips, sets pickup/dropoff coordinates, reviews fares, rates driver."
      },
      {
        name: "Driver",
        role: "Provider",
        description: "Sets status to active, publishes telemetry locations, accepts trips, drives routes."
      },
      {
        name: "Dispatch Engine",
        role: "Core Service",
        description: "Orchestrates driver search radius, dynamic routing, surge multi-pliers, and locks bookings."
      }
    ],
    useCases: [
      {
        actor: "Driver",
        action: "Pings live coordinates to the map gateway.",
        benefit: "Maintains live availability map in Redis for rider geospatial discovery."
      },
      {
        actor: "Rider",
        action: "Requests trip; Dispatch Engine locks best driver, routing coordinates.",
        benefit: "Matches riders with nearby drivers in seconds with minimal ride delay."
      },
      {
        actor: "Dispatch Engine",
        action: "Triggers Stripe invoice charge upon driver completing trip.",
        benefit: "Secures financial settlement transparently for passengers and contractors."
      }
    ],
    techStack: [
      {
        category: "Client & Map Layer",
        technologies: [
          { name: "React Native", reason: "Powers cross-platform iOS and Android map routing interfaces." },
          { name: "Mapbox / Google Maps API", reason: "Renders road maps, executes routing geometry (polyline calculations)." }
        ]
      },
      {
        category: "Real-time & APIs",
        technologies: [
          { name: "gRPC / Protobuf", reason: "Enables lightweight, low-overhead bidirectional streaming of GPS locations between mobile devices and backend." },
          { name: "Kafka (Apache)", reason: "Event streaming platform handling location streams, trip events, and analytics logs." }
        ]
      },
      {
        category: "Databases & Cache",
        technologies: [
          { name: "Redis Enterprise", reason: "Utilizes Redis GEO indexes for fast nearby searches (<10ms queries for active drivers)." },
          { name: "Apache Cassandra", reason: "Distributed NoSQL database handling billions of location history rows with high write-throughput." },
          { name: "PostgreSQL", reason: "ACID compliant storage for ride billing, client invoices, and user registration." }
        ]
      },
      {
        category: "DevOps & Routing",
        technologies: [
          { name: "Kubernetes (EKS)", reason: "Manages container clusters across microservices (dispatch, rating, mapping)." },
          { name: "OSRM (Open Source Routing)", reason: "Local hosting of routing profiles to avoid costly third-party route call API fees." }
        ]
      }
    ],
    databaseDesign: [
      {
        tableName: "trips",
        description: "Tracks active and historical trips with final pricing, route polylines.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique trip identifier." },
          { name: "rider_id", type: "UUID", key: "FK", nullable: false, description: "Passenger requesting trip." },
          { name: "driver_id", type: "UUID", key: "FK", nullable: true, description: "Driver assigned to trip." },
          { name: "status", type: "VARCHAR(50)", nullable: false, description: "Status (REQUESTED, ACCEPTED, ON_TRIP, COMPLETED, CANCELLED)." },
          { name: "pickup_lat_lng", type: "POINT", nullable: false, description: "Pickup coordinate geometry." },
          { name: "dropoff_lat_lng", type: "POINT", nullable: false, description: "Destination coordinate geometry." },
          { name: "fare", type: "NUMERIC(10,2)", nullable: false, description: "Charged amount." }
        ]
      },
      {
        tableName: "driver_locations",
        description: "Cassandra partitioned store holding tracking history.",
        columns: [
          { name: "driver_id", type: "UUID", key: "PK", nullable: false, description: "Partition key identifying the driver." },
          { name: "timestamp", type: "TIMESTAMP", key: "PK", nullable: false, description: "Clustering key sorted descending." },
          { name: "latitude", type: "DOUBLE", nullable: false, description: "GPS latitude coordinate." },
          { name: "longitude", type: "DOUBLE", nullable: false, description: "GPS longitude coordinate." }
        ]
      }
    ],
    apiEndpoints: [
      {
        method: "POST",
        endpoint: "/api/v1/trips/request",
        description: "Rider requests a ride. Locks coordinates and kicks off driver matching search loops.",
        requestBody: '{\n  "rider_id": "rider-123",\n  "pickup": { "lat": 40.7128, "lng": -74.0060 },\n  "dropoff": { "lat": 40.7589, "lng": -73.9851 },\n  "vehicle_type": "standard"\n}',
        responseBody: '{\n  "trip_id": "trip-889-abc",\n  "status": "SEARCHING_DRIVERS",\n  "estimated_fare": 24.50,\n  "eta_minutes": 6\n}'
      },
      {
        method: "GET",
        endpoint: "/api/v1/trips/{trip_id}/status",
        description: "Retrieves live trip status, including driver assignment and GPS coordinates.",
        responseBody: '{\n  "trip_id": "trip-889-abc",\n  "status": "ACCEPTED",\n  "driver": {\n    "name": "John Doe",\n    "location": { "lat": 40.7201, "lng": -74.0110 },\n    "license_plate": "XYZ-9988"\n  }\n}'
      }
    ],
    systemArchitecture: {
      type: "Microservices Geolocation Grid Architecture",
      diagramText: "Driver App -> gRPC Location Gateway -> Kafka Location Stream -> Redis Geospatial DB -> Matcher Service & Cassandra (History) -> Rider App (Websocket Update)",
      description: "Real-time dispatch using dual databases. Live driver locations stream via gRPC into Kafka, updating a Redis Geospatial index. When a rider requests a trip, the Matcher service queries Redis for nearby drivers, locks the selected driver, and broadcasts updates over WebSockets.",
      nodes: [
        { id: "driver", label: "Driver Mobile App (gRPC)", type: "client" },
        { id: "gateway", label: "gRPC Location Ingestion Gateway", type: "network" },
        { id: "kafka", label: "Apache Kafka Ingestion Topic", type: "network" },
        { id: "redis", label: "Redis GEO (Live Coordinates)", type: "cache" },
        { id: "matcher", label: "Trip Matcher Service", type: "compute" },
        { id: "rider", label: "Rider Mobile App (Websocket)", type: "client" },
        { id: "cassandra", label: "Cassandra DB (Trip Tracks)", type: "database" }
      ],
      connections: [
        { from: "driver", to: "gateway", label: "GPS Coordinates (gRPC stream)" },
        { from: "gateway", to: "kafka", label: "Publish location events" },
        { from: "kafka", to: "redis", label: "Upsert active driver coordinate" },
        { from: "kafka", to: "cassandra", label: "Persist logs for audit" },
        { from: "matcher", to: "redis", label: "Find active drivers in 2km" },
        { from: "matcher", to: "rider", label: "Notify match status (Websockets)" }
      ]
    },
    scalability: [
      "Geographical Sharding: Partition Redis clusters geographically (e.g. city-based boundaries) to scale location ingestion horizontally.",
      "Cassandra Clustering: Scale Cassandra write-only nodes globally without cross-region locks.",
      "Backpressure Handling: Throttle GPS client write frequencies during severe traffic jams."
    ],
    security: [
      {
        category: "Rider Safety",
        measures: [
          "Enforce coordinate anonymization, hiding exact rider coordinates from drivers before booking confirmation.",
          "Background checks API validation checks integrated with driver onboarding registration processes."
        ]
      },
      {
        category: "Network Defense",
        measures: [
          "gRPC mutual TLS (mTLS) authentication validating physical driver mobile hardware keys.",
          "Implement WebSocket rate-limiting protecting matches database from automated fake booking floods."
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: Location Telemetry",
        duration: "Weeks 1 - 5",
        tasks: [
          "Setup gRPC server in Go and configure Redis Geo ingestion logic.",
          "Build mock rider and driver simulation scripts streaming coordinate data.",
          "Integrate Mapbox API on mobile apps for route geometry drawing."
        ]
      },
      {
        phase: "Phase 2: Dispatcher Core",
        duration: "Weeks 6 - 10",
        tasks: [
          "Implement matching rings algorithm (expanding search area if no drivers accept).",
          "Setup Kafka message brokers to pipeline route updates safely.",
          "Deploy Apache Cassandra clusters and verify write workloads."
        ]
      },
      {
        phase: "Phase 3: Payments & Scaling",
        duration: "Weeks 11 - 15",
        tasks: [
          "Configure Stripe escrow payments (matching rider charge with driver payout split).",
          "Conduct GPS packet drop resilience testing simulating tunnel disconnection."
        ]
      }
    ]
  },
  "build-airbnb": {
    summary: {
      title: "Vacation Rental Platform Architecture (Airbnb)",
      description: "A robust, search-optimized property rental platform. This system prioritizes low-latency searches across millions of active listings, manages calendar availability, and processes secure escrow-based reservation booking states.",
      complexity: "High",
      readingTime: "5 min read",
      targetAudience: "Technical Product Managers, Database Leads, Frontend Engineers",
      estimatedCost: "$250 - $600 / month (Initial staging scale with CDN)",
      primaryDatabase: "PostgreSQL (Bookings & Invoices) + Elasticsearch (Listing Search Engine)"
    },
    functionalRequirements: [
      "Hosts can post property details, manage rates, and upload high-resolution image galleries.",
      "Guests can search properties by location, availability dates, prices, and filter criteria.",
      "Reservation calendar prevents overlapping dates and blocks double bookings.",
      "Guests can message hosts, request booking approval, and complete payments.",
      "Guests can leave reviews with multi-dimension rating systems."
    ],
    nonFunctionalRequirements: [
      "Search Latency: Return matching listings under 150ms globally.",
      "Double Bookings: Maintain transactional locking ensuring zero calendar overlaps.",
      "SEO & SSR: Pre-render listing detail pages using Next.js Server Components for indexing.",
      "Static Assets: Serve property images under 500ms using globally cached CDNs."
    ],
    actors: [
      {
        name: "Guest",
        role: "End User",
        description: "Searches properties, requests reservations, communicates with hosts, makes payments."
      },
      {
        name: "Host",
        role: "Provider",
        description: "Creates listings, configures calendar, sets pricing, approves booking requests."
      },
      {
        name: "Search Processor",
        role: "Background Service",
        description: "Syncs PostgreSQL listing updates into Elasticsearch indexes in real-time."
      }
    ],
    useCases: [
      {
        actor: "Guest",
        action: "Searches listings for 'Paris' with date parameters.",
        benefit: "Returns relevant, available properties instantly based on geolocations."
      },
      {
        actor: "Guest",
        action: "Books booking; database isolates calendar check in a transaction block.",
        benefit: "Eliminates double booking errors, ensuring listing calendar safety."
      },
      {
        actor: "Host",
        action: "Adds new images to their house gallery.",
        benefit: "Images upload, compress, and serve via CDN for low-cost asset hosting."
      }
    ],
    techStack: [
      {
        category: "Frontend Layer",
        technologies: [
          { name: "Next.js 15", reason: "Provides Server Side Rendering (SSR) for property detail pages, boosting search engine SEO indexing." },
          { name: "Framer Motion", reason: "Subtle gallery carousel animations, card transitions." }
        ]
      },
      {
        category: "App Services",
        technologies: [
          { name: "Node.js (NestJS)", reason: "Structured TypeScript framework to manage listing APIs and reservation bookings." },
          { name: "Elastisearch / OpenSearch", reason: "Fuzzy search engine enabling fast filtering by geography, price ranges, and tags." }
        ]
      },
      {
        category: "Storage & Cache",
        technologies: [
          { name: "PostgreSQL", reason: "ACID transactions protect booking locks and financial ledger records." },
          { name: "Redis", reason: "Caches search aggregates and static configurations to bypass DB lookups." },
          { name: "AWS S3 / Cloudflare Images", reason: "Dynamic image optimization, automatic sizing, and edge compression." }
        ]
      }
    ],
    databaseDesign: [
      {
        tableName: "listings",
        description: "Details for vacation rental properties.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique listing identifier." },
          { name: "host_id", type: "UUID", key: "FK", nullable: false, description: "Host account owner." },
          { name: "title", type: "VARCHAR(200)", nullable: false, description: "Name of property listing." },
          { name: "price_per_night", type: "NUMERIC(10,2)", nullable: false, description: "Base daily fee." },
          { name: "location_point", type: "POINT", nullable: false, description: "Geographic coordinate point." },
          { name: "max_guests", type: "INTEGER", nullable: false, description: "Max capacity limit." }
        ]
      },
      {
        tableName: "reservations",
        description: "Booking logs containing schedule reservations and check-in dates.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Booking reservation ID." },
          { name: "listing_id", type: "UUID", key: "FK", nullable: false, description: "Link to reserved listing." },
          { name: "guest_id", type: "UUID", key: "FK", nullable: false, description: "Renter user account." },
          { name: "check_in", type: "DATE", nullable: false, description: "Starting reservation date." },
          { name: "check_out", type: "DATE", nullable: false, description: "Ending reservation date." },
          { name: "status", type: "VARCHAR(50)", nullable: false, description: "Status (PENDING, CONFIRMED, COMPLETED, REFUNDED)." }
        ]
      }
    ],
    apiEndpoints: [
      {
        method: "GET",
        endpoint: "/api/v1/search",
        description: "Queries Elasticsearch for active listings matching location, capacity, dates, and price bands.",
        responseBody: '{\n  "listings": [\n    { "id": "list-1", "title": "Cozy Paris Flat", "price": 120.00, "rating": 4.9 }\n  ],\n  "total_hits": 240\n}'
      },
      {
        method: "POST",
        endpoint: "/api/v1/reservations/book",
        description: "Creates reservation. Initiates database lock on listing calendar for requested dates.",
        requestBody: '{\n  "listing_id": "list-1",\n  "check_in": "2026-08-10",\n  "check_out": "2026-08-15"\n}',
        responseBody: '{\n  "booking_id": "booking-990-abc",\n  "status": "PENDING_PAYMENT",\n  "total_price": 600.00\n}'
      }
    ],
    systemArchitecture: {
      type: "Search-Optimized Rental Architecture",
      diagramText: "Next.js Web Client -> ALB -> Node.js API -> PostgreSQL (Primary Write) -> Debezium CDC -> Kafka -> Elasticsearch (Search Query Router)",
      description: "Listing details are saved in PostgreSQL. A CDC (Change Data Capture) tool streams updates to Elasticsearch via Kafka. Client searches read from Elasticsearch, bypassing PostgreSQL to maintain <50ms query speeds under heavy loads.",
      nodes: [
        { id: "client", label: "Web / Mobile Guest Client", type: "client" },
        { id: "api", label: "Node.js (NestJS) API", type: "compute" },
        { id: "db", label: "PostgreSQL Database (Transactional)", type: "database" },
        { id: "cdc", label: "Debezium Change Data Capture", type: "network" },
        { id: "search", label: "Elasticsearch Query Cluster", type: "database" },
        { id: "images", label: "Cloudflare Images + CDN", type: "cache" }
      ],
      connections: [
        { from: "client", to: "images", label: "Load compressed listing photos" },
        { from: "client", to: "api", label: "Book stay request" },
        { from: "client", to: "api", label: "Filter/Search listings" },
        { from: "api", to: "search", label: "Route search queries" },
        { from: "api", to: "db", label: "Execute booking transaction" },
        { from: "db", to: "cdc", label: "Capture insert/updates logs" },
        { from: "cdc", to: "search", label: "Sync elastic index" }
      ]
    },
    scalability: [
      "Command-Query Responsibility Segregation (CQRS): Separates primary booking transactions (PostgreSQL) from search indexes (Elasticsearch).",
      "Dynamic Image Compression: Optimizes photos at the edge based on device pixel ratio, saving bandwidth.",
      "Redis Rental Calendars: Caches reservation date ranges in bit arrays for fast, lightweight availability queries."
    ],
    security: [
      {
        category: "Escrow & Payment Safety",
        measures: [
          "Hold transaction funds in Stripe Connect escrow accounts until 24 hours post check-in.",
          "Mask messaging metadata, blocking hosts from requesting off-platform bypass payments."
        ]
      },
      {
        category: "Data Isolation",
        measures: [
          "Validate host and user permissions before serving private host addresses or check-in codes.",
          "Sanitize listing descriptions to filter out script injections or embedded malware."
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: DB & Elastic Sync",
        duration: "Weeks 1 - 4",
        tasks: [
          "Design Postgres schema tables and create indexing bounds.",
          "Setup Elasticsearch templates and write manual data synchronization scripts.",
          "Construct API routes for listings insertion and search query testing."
        ]
      },
      {
        phase: "Phase 2: Booking Workflows",
        duration: "Weeks 5 - 8",
        tasks: [
          "Write Postgres locking queries to guarantee zero booking overlaps.",
          "Build dynamic date picker calendar elements in React.",
          "Connect host image upload interfaces to S3 CDN configurations."
        ]
      },
      {
        phase: "Phase 3: Reviews & Payouts",
        duration: "Weeks 9 - 12",
        tasks: [
          "Integrate Stripe Connect split payments for hosts.",
          "Construct review sub-systems with math averages calculated on read tasks."
        ]
      }
    ]
  },
  "inventory-management-system": {
    summary: {
      title: "Inventory & Warehouse Management System",
      description: "An enterprise warehouse management application for tracking stock, managing supplier orders, and auditing stock levels. The system guarantees atomic stock changes under high transaction speeds, tracks serial numbers, and flags low-stock items automatically.",
      complexity: "Medium",
      readingTime: "4 min read",
      targetAudience: "Technical Operations Managers, Database Engineers, Lead Developers",
      estimatedCost: "$120 - $350 / month",
      primaryDatabase: "PostgreSQL (Relational, ACID transactions)"
    },
    functionalRequirements: [
      "Manage item catalog records, including SKU, category, supplier, and warehouse zones.",
      "Track stock quantities (committed, available, in-transit) across multiple locations.",
      "Generate purchase orders automatically when stock levels cross minimum reorder thresholds.",
      "Implement barcode/QR scanning APIs for quick item updates on mobile devices.",
      "Compile comprehensive inventory audit logs detailing stock updates."
    ],
    nonFunctionalRequirements: [
      "Data Integrity: Strict ACID compliance preventing negative stock levels.",
      "Sync Speed: Refresh warehouse dashboards within 2 seconds of barcode scans.",
      "Offline Sync: Enable mobile devices to scan barcodes offline and sync once reconnected.",
      "Search: Index SKU numbers to return searches in <50ms."
    ],
    actors: [
      {
        name: "Warehouse Worker",
        role: "Operator",
        description: "Scans barcodes during intake, moves stock across shelves, updates item statuses."
      },
      {
        name: "Procurement Manager",
        role: "Manager",
        description: "Approves purchase orders, manages supplier listings, audits discrepancy metrics."
      },
      {
        name: "Barcode Scanner Device",
        role: "Client Hardware",
        description: "Ingests SKU barcodes, sends inventory change payloads to API."
      }
    ],
    useCases: [
      {
        actor: "Warehouse Worker",
        action: "Scans inbound pallet; stock count increases.",
        benefit: "Instantly logs stock availability for ecommerce orders."
      },
      {
        actor: "Procurement Manager",
        action: "Reviews auto-flagged low stock alerts and orders from suppliers.",
        benefit: "Prevents stockouts without manual sheet monitoring."
      },
      {
        actor: "Barcode Scanner Device",
        action: "Submits cached queue offline scans upon regaining network connection.",
        benefit: "Prevents data loss during network dropouts in large steel warehouses."
      }
    ],
    techStack: [
      {
        category: "Frontend Layer",
        technologies: [
          { name: "Next.js 15", reason: "Powers clean inventory management dashboards with Server Actions for quick forms." },
          { name: "React Query", reason: "Ensures real-time client state sync with background fetching intervals." }
        ]
      },
      {
        category: "Backend Engine",
        technologies: [
          { name: "Go / Gin", reason: "Lightweight, high-concurrency language to process scanner telemetry with minimal memory footprint." }
        ]
      },
      {
        category: "Storage",
        technologies: [
          { name: "PostgreSQL", reason: "Enforces strict database constraints (e.g. CHECK status >= 0) to guarantee transaction integrity." },
          { name: "Redis", reason: "Distributed locks to handle multi-worker modifications of identical SKU quantities." }
        ]
      }
    ],
    databaseDesign: [
      {
        tableName: "inventory_items",
        description: "Catalog record for SKU items with safety stock metrics.",
        columns: [
          { name: "sku", type: "VARCHAR(50)", key: "PK", nullable: false, description: "Unique stock keeping unit code." },
          { name: "name", type: "VARCHAR(150)", nullable: false, description: "Item label." },
          { name: "quantity_on_hand", type: "INTEGER", nullable: false, description: "Total inventory physically in warehouse." },
          { name: "reorder_threshold", type: "INTEGER", nullable: false, description: "Minimum quantity before triggering restocking alert." },
          { name: "warehouse_zone", type: "VARCHAR(20)", nullable: false, description: "Physical location (e.g., Aisle 4, Shelf B)." }
        ]
      },
      {
        tableName: "stock_transactions",
        description: "Audit trail log tracking quantity adjustments.",
        columns: [
          { name: "id", type: "BIGSERIAL", key: "PK", nullable: false, description: "Incremental log primary key." },
          { name: "sku", type: "VARCHAR(50)", key: "FK", nullable: false, description: "Adjusted product record." },
          { name: "quantity_change", type: "INTEGER", nullable: false, description: "Signed change (+5 count intake, -2 count checkout)." },
          { name: "reference_code", type: "VARCHAR(100)", nullable: true, description: "Associated order ID." },
          { name: "recorded_at", type: "TIMESTAMP", nullable: false, description: "Date of transaction." }
        ]
      }
    ],
    apiEndpoints: [
      {
        method: "POST",
        endpoint: "/api/v1/inventory/adjust",
        description: "Updates quantity levels for a product. Executes in transactional block.",
        requestBody: '{\n  "sku": "SKU-MONITOR-32",\n  "adjustment": -4,\n  "reason": "checkout_order",\n  "reference_code": "PO-10293"\n}',
        responseBody: '{\n  "sku": "SKU-MONITOR-32",\n  "previous_qty": 12,\n  "new_qty": 8,\n  "reorder_triggered": false\n}'
      },
      {
        method: "GET",
        endpoint: "/api/v1/inventory/low-stock",
        description: "Retrieves list of products whose stock levels are below their reorder threshold.",
        responseBody: '{\n  "items": [\n    { "sku": "SKU-CABLE-HDMI", "name": "HDMI Cord 6ft", "qty": 3, "threshold": 10 }\n  ]\n}'
      }
    ],
    systemArchitecture: {
      type: "Transactional Inventory Architecture",
      diagramText: "Scanner Device -> ALB -> Go API Server -> Redis Locks -> PostgreSQL (Atomic Writes) -> Alert Dispatcher (SQS) -> Email/Slack Notifications",
      description: "Workers modify stock levels via API endpoints. The Go backend acquires a distributed Redis lock on the product SKU, updates the PostgreSQL item record within a transactional block, releases the lock, and publishes low-stock events to an SQS queue.",
      nodes: [
        { id: "scanner", label: "Mobile Scanner / Web Client", type: "client" },
        { id: "api", label: "Go API Service", type: "compute" },
        { id: "redis", label: "Redis Distributed Locks", type: "cache" },
        { id: "db", label: "PostgreSQL Database (ACID)", type: "database" },
        { id: "sqs", label: "AWS SQS Alert Queue", type: "network" },
        { id: "notification", label: "Alert Dispatcher (SNS/Email)", type: "compute" }
      ],
      connections: [
        { from: "scanner", to: "api", label: "Post stock adjustment" },
        { from: "api", to: "redis", label: "Acquire SKU lock" },
        { from: "api", to: "db", label: "Update quantity on hand" },
        { from: "api", to: "redis", label: "Release SKU lock" },
        { from: "api", to: "sqs", label: "Trigger low stock event" },
        { from: "sqs", to: "notification", label: "Dispatch supplier alerts" }
      ]
    },
    scalability: [
      "SKU Lock Isolation: Locking at the SKU level ensures workers update different inventory items concurrently without blocking.",
      "Read Caching: Cache product descriptions and categories in Redis to minimize SQL database lookups.",
      "Database Partitioning: Partition transaction history tables by month to maintain fast query speeds as data grows."
    ],
    security: [
      {
        category: "Access Audits",
        measures: [
          "Validate worker login tokens before modifying inventory levels.",
          "Keep historical transactions read-only to prevent tampering with audit logs."
        ]
      },
      {
        category: "Input Hardening",
        measures: [
          "Validate SKU formats to prevent SQL injections or command execution payloads.",
          "Restrict maximum stock adjustments per call to prevent database overflow errors."
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: Inventory Core",
        duration: "Weeks 1 - 3",
        tasks: [
          "Setup PostgreSQL catalog tables and write constraints.",
          "Build Go API routes for listing products and managing safety stock.",
          "Create web layouts for viewing inventory items."
        ]
      },
      {
        phase: "Phase 2: Transactions & Locks",
        duration: "Weeks 4 - 6",
        tasks: [
          "Write Postgres transaction queries to update stock levels.",
          "Configure Redis database to handle SKU distributed locks.",
          "Build audit log pages to view historical stock changes."
        ]
      },
      {
        phase: "Phase 3: Barcodes & Alerts",
        duration: "Weeks 7 - 9",
        tasks: [
          "Implement barcode/QR code scanners on frontend views.",
          "Configure automated alerts to notify procurement managers when safety thresholds are breached."
        ]
      }
    ]
  },
  "hospital-management-system": {
    summary: {
      title: "Hospital & Patient Information System",
      description: "A secure, HIPAA-compliant patient management system. It coordinates doctor appointments, records clinical histories, manages laboratory results, and handles medical billing while maintaining high security controls.",
      complexity: "High",
      readingTime: "5 min read",
      targetAudience: "Healthcare Technical Advisors, Compliance Officers, Lead Engineers",
      estimatedCost: "$150 - $400 / month (Staging setup on AWS HIPAA VPC)",
      primaryDatabase: "PostgreSQL (Encrypted Relational Data) + AWS S3 (Encrypted Medical Scans)"
    },
    functionalRequirements: [
      "Manage electronic health records (EHR) containing diagnosis histories and vitals.",
      "Display doctor schedules and manage appointment bookings.",
      "Upload and view medical imaging scans (X-Rays, MRIs) securely.",
      "Generate patient invoices, process payments, and track insurance claims.",
      "Support role-based access control (doctor, nurse, receptionist, patient)."
    ],
    nonFunctionalRequirements: [
      "HIPAA Compliance: Enforce encryption at rest (AES-256) and audit all access logs.",
      "Data Isolation: Isolate patient health records to prevent unauthorized views.",
      "Availability: Maintain high-availability failover databases for clinical systems.",
      "Audit Trail: Keep permanent, unalterable records of who views any patient file."
    ],
    actors: [
      {
        name: "Doctor",
        role: "Clinician",
        description: "Reviews patient histories, records diagnoses, prescribes medications, views scans."
      },
      {
        name: "Receptionist",
        role: "Operator",
        description: "Manages check-ins, books appointments, edits billing profiles."
      },
      {
        name: "Patient",
        role: "End User",
        description: "Views upcoming appointments, downloads lab results, pays bills online."
      }
    ],
    useCases: [
      {
        actor: "Doctor",
        action: "Views patient record; system logs an audit entry.",
        benefit: "Allows reviews of medical histories while meeting compliance requirements."
      },
      {
        actor: "Receptionist",
        action: "Schedules appointment on doctor's calendar.",
        benefit: "Coordinates schedules to prevent overlapping bookings."
      },
      {
        actor: "Patient",
        action: "Downloads clinical lab report PDF from patient portal.",
        benefit: "Provides instant access to medical information from home."
      }
    ],
    techStack: [
      {
        category: "Frontend Layer",
        technologies: [
          { name: "Next.js 15", reason: "React framework with Server Side Rendering for patient portals." },
          { name: "Tailwind CSS", reason: "Utility styling system to maintain high-performance layouts." }
        ]
      },
      {
        category: "Backend Engine",
        technologies: [
          { name: "Java / Spring Boot", reason: "Enterprise-grade backend with Spring Security for managing HIPAA access controls." }
        ]
      },
      {
        category: "Databases & Cloud",
        technologies: [
          { name: "AWS Aurora PostgreSQL", reason: "Relational database with automated scaling and encryption." },
          { name: "AWS S3 KMS", reason: "Secure cloud bucket for storing encrypted medical scans and patient records." }
        ]
      }
    ],
    databaseDesign: [
      {
        tableName: "patients",
        description: "Encrypted table holding patient PII details.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique patient identifier." },
          { name: "first_name_enc", type: "BYTEA", nullable: false, description: "AES-256 encrypted first name." },
          { name: "last_name_enc", type: "BYTEA", nullable: false, description: "AES-256 encrypted last name." },
          { name: "date_of_birth_enc", type: "BYTEA", nullable: false, description: "AES-256 encrypted birthdate." },
          { name: "insurance_provider", type: "VARCHAR(100)", nullable: true, description: "Patient's insurance carrier." },
          { name: "created_at", type: "TIMESTAMP", nullable: false, description: "Registration timestamp." }
        ]
      },
      {
        tableName: "medical_records",
        description: "Clinical patient charts, symptoms, and diagnoses.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique record identifier." },
          { name: "patient_id", type: "UUID", key: "FK", nullable: false, description: "Foreign key referencing patients(id)." },
          { name: "doctor_id", type: "UUID", nullable: false, description: "Doctor record author." },
          { name: "diagnosis_notes_enc", type: "BYTEA", nullable: false, description: "Encrypted diagnosis notes." },
          { name: "prescribed_medication", type: "VARCHAR(250)", nullable: true, description: "Prescribed medicines." },
          { name: "recorded_at", type: "TIMESTAMP", nullable: false, description: "Time of clinical consult." }
        ]
      }
    ],
    apiEndpoints: [
      {
        method: "GET",
        endpoint: "/api/v1/patients/{patient_id}/records",
        description: "Retrieves a patient's medical history. Logs details to audit logs.",
        responseBody: '{\n  "patient_id": "patient-123-uuid",\n  "records": [\n    { "id": "rec-1", "diagnosis": "Hypertension", "prescribed": "Lisinopril 10mg", "date": "2026-05-12" }\n  ]\n}'
      },
      {
        method: "POST",
        endpoint: "/api/v1/appointments/schedule",
        description: "Schedules doctor consult. Validates availability.",
        requestBody: '{\n  "patient_id": "patient-123-uuid",\n  "doctor_id": "doctor-887-uuid",\n  "appointment_time": "2026-08-12T10:00:00Z"\n}',
        responseBody: '{\n  "appointment_id": "appt-1029-abc",\n  "status": "SCHEDULED",\n  "calendar_event": "2026-08-12T10:00:00Z"\n}'
      }
    ],
    systemArchitecture: {
      type: "HIPAA Secure Clinical Architecture",
      diagramText: "Clinician Client -> AWS WAF -> VPC Load Balancer -> Spring Boot API Server (EC2) -> AWS KMS Encryption -> PostgreSQL (Encrypted Records) & S3 (Encrypted Scans)",
      description: "Patients and doctors connect through an AWS WAF load balancer. All patient records (EHR) are encrypted in the Spring Boot backend using AWS KMS keys before being saved to PostgreSQL or S3, meeting strict security requirements.",
      nodes: [
        { id: "client", label: "Clinician Portal Web Client", type: "client" },
        { id: "waf", label: "AWS WAF Firewall Security", type: "network" },
        { id: "app", label: "Spring Boot API Server", type: "compute" },
        { id: "kms", label: "AWS KMS Key Management", type: "cache" },
        { id: "db", label: "Aurora PostgreSQL (Encrypted)", type: "database" },
        { id: "s3", label: "AWS S3 Medical Storage", type: "database" }
      ],
      connections: [
        { from: "client", to: "waf", label: "HTTPS (TLS 1.3)" },
        { from: "waf", to: "app", label: "Forward request" },
        { from: "app", to: "kms", label: "Request encryption key" },
        { from: "app", to: "db", label: "Save encrypted data" },
        { from: "app", to: "s3", label: "Save encrypted scans" }
      ]
    },
    scalability: [
      "VPC Peering: Peer the clinic network with labs and insurance providers to enable secure, fast data sharing.",
      "Database Scaling: Provision secondary database nodes to offload read queries from clinical dashboards.",
      "Object Storage: Store medical scans in S3 to enable scalable file storage."
    ],
    security: [
      {
        category: "HIPAA Compliancy",
        measures: [
          "Encrypt patient records (PII) at the field level in PostgreSQL.",
          "Keep immutable database audit logs to track all patient file views."
        ]
      },
      {
        category: "Access Controls",
        measures: [
          "Enforce multi-factor authentication (MFA) for all hospital employee accounts.",
          "Timeout sessions automatically after 10 minutes of inactivity to protect clinical workstations."
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: VPC Setup & DB Encryption",
        duration: "Weeks 1 - 4",
        tasks: [
          "Setup AWS VPC networks and subnets.",
          "Configure PostgreSQL database encryption.",
          "Implement medical scan upload utilities."
        ]
      },
      {
        phase: "Phase 2: EHR APIs & Portals",
        duration: "Weeks 5 - 8",
        tasks: [
          "Build doctor schedules and calendar appointment bookings.",
          "Connect frontend patient dashboards to records APIs.",
          "Verify field-level encryption for patient names and dates."
        ]
      },
      {
        phase: "Phase 3: Billing & Auditing",
        duration: "Weeks 9 - 12",
        tasks: [
          "Integrate medical billing and insurance claims pipelines.",
          "Deploy logging systems to audit patient record views."
        ]
      }
    ]
  },
  "crm-platform": {
    summary: {
      title: "Enterprise CRM Platform Architecture",
      description: "A customer relationship management platform for sales teams. The system manages lead sales funnels, tracks pipeline progress, schedules customer meetings, and logs activity histories while supporting multi-tenant databases.",
      complexity: "High",
      readingTime: "4 min read",
      targetAudience: "CTOs, Sales Managers, Database Administrators",
      estimatedCost: "$150 - $400 / month",
      primaryDatabase: "PostgreSQL (Multi-tenant schema Isolation) + Elasticsearch (Global customer search)"
    },
    functionalRequirements: [
      "Manage contacts, customer company records, and sales lead lists.",
      "Display visual sales pipelines (kanban stages) for sales tracking.",
      "Log customer communications (emails, meetings, calls).",
      "Assign tasks to team members, set deadlines, and send email reminders.",
      "Generate sales report analytics and performance dashboards."
    ],
    nonFunctionalRequirements: [
      "Tenant Isolation: Restrict data access to the user's tenant account.",
      "Search Speed: Return contact query searches in under 100ms.",
      "API Capacity: Support up to 5,000 requests per minute.",
      "Export: Download contact lists as CSV files in under 3 seconds."
    ],
    actors: [
      {
        name: "Sales Agent",
        role: "Operator",
        description: "Manages contacts, moves pipeline stages, logs call outcomes."
      },
      {
        name: "Sales Director",
        role: "Manager",
        description: "Reviews team performance, monitors deals pipeline status, creates tasks."
      },
      {
        name: "System Sync Worker",
        role: "Background Service",
        description: "Syncs email messages from connected GSuite/Outlook mailboxes."
      }
    ],
    useCases: [
      {
        actor: "Sales Agent",
        action: "Moves lead card from 'Contacted' to 'Proposal Sent'.",
        benefit: "Updates deal pipelines and schedules follow-up tasks."
      },
      {
        actor: "Sales Director",
        action: "Views quarterly deal dashboards and forecast charts.",
        benefit: "Monitors team performance and helps forecast sales numbers."
      },
      {
        actor: "System Sync Worker",
        action: "Imports incoming emails into activity streams.",
        benefit: "Saves communication records without manual copy-paste step."
      }
    ],
    techStack: [
      {
        category: "Frontend Layer",
        technologies: [
          { name: "Next.js 15", reason: "React framework supporting dashboard Server Components." },
          { name: "Tailwind CSS & shadcn/ui", reason: "Provides clean user interfaces for CRM workspaces." }
        ]
      },
      {
        category: "Backend Engine",
        technologies: [
          { name: "Node.js (NestJS)", reason: "Modular backend framework with built-in multi-tenant request interceptors." }
        ]
      },
      {
        category: "Data & Caching",
        technologies: [
          { name: "PostgreSQL", reason: "Relational database with schema-based multi-tenant data isolation." },
          { name: "Elasticsearch", reason: "Fuzzy search engine for searching through millions of contact records." }
        ]
      }
    ],
    databaseDesign: [
      {
        tableName: "contacts",
        description: "Customer contacts isolated by tenant accounts.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique contact identifier." },
          { name: "tenant_id", type: "UUID", key: "FK", nullable: false, description: "Foreign key referencing tenants(id)." },
          { name: "first_name", type: "VARCHAR(100)", nullable: false, description: "Contact first name." },
          { name: "last_name", type: "VARCHAR(100)", nullable: false, description: "Contact last name." },
          { name: "email", type: "VARCHAR(255)", nullable: false, description: "Contact email." },
          { name: "deal_stage", type: "VARCHAR(50)", nullable: false, description: "Stage (PROSPECT, CONTACTED, PROPOSAL, CLOSED_WON, CLOSED_LOST)." }
        ]
      },
      {
        tableName: "activities",
        description: "Communications logs and tasks.",
        columns: [
          { name: "id", type: "UUID", key: "PK", nullable: false, description: "Unique activity identifier." },
          { name: "tenant_id", type: "UUID", key: "FK", nullable: false, description: "Linked tenant account." },
          { name: "contact_id", type: "UUID", key: "FK", nullable: false, description: "Foreign key referencing contacts(id)." },
          { name: "type", type: "VARCHAR(50)", nullable: false, description: "Type (EMAIL, CALL, MEETING, TASK)." },
          { name: "summary", type: "TEXT", nullable: false, description: "Summary notes of activity." },
          { name: "due_date", type: "TIMESTAMP", nullable: true, description: "Task deadline." }
        ]
      }
    ],
    apiEndpoints: [
      {
        method: "GET",
        endpoint: "/api/v1/contacts/search",
        description: "Search contact records using Elasticsearch.",
        responseBody: '{\n  "contacts": [\n    { "id": "cont-1", "name": "Bruce Wayne", "email": "bruce@wayne.corp", "stage": "PROSPECT" }\n  ]\n}'
      },
      {
        method: "PUT",
        endpoint: "/api/v1/deals/{deal_id}/stage",
        description: "Updates a deal stage and schedules follow-up tasks.",
        requestBody: '{\n  "new_stage": "CLOSED_WON"\n}',
        responseBody: '{\n  "deal_id": "deal-998-uuid",\n  "status": "updated",\n  "new_stage": "CLOSED_WON",\n  "followup_task_created": true\n}'
      }
    ],
    systemArchitecture: {
      type: "Multi-Tenant CRM Architecture",
      diagramText: "Sales Client -> Tenant Middleware (NestJS) -> PostgreSQL (Schema-per-tenant) -> Elasticsearch Index -> Mail Sync Worker (OAuth)",
      description: "Next.js clients query a multi-tenant NestJS backend. A middleware interceptor extracts the tenant header, configures database connection pools, routing writes to the tenant's PostgreSQL schema, and syncs updates to Elasticsearch.",
      nodes: [
        { id: "client", label: "Web / Mobile CRM Client", type: "client" },
        { id: "api", label: "NestJS Tenant API Service", type: "compute" },
        { id: "db", label: "PostgreSQL (Multi-tenant Schemas)", type: "database" },
        { id: "elastic", label: "Elasticsearch Search Engine", type: "database" },
        { id: "sync", label: "Mail Sync Worker (OAuth)", type: "compute" }
      ],
      connections: [
        { from: "client", to: "api", label: "API request with Tenant-ID header" },
        { from: "api", to: "db", label: "Dynamic tenant schema routing" },
        { from: "api", to: "elastic", label: "Route contact search queries" },
        { from: "db", to: "elastic", label: "Sync database updates" },
        { from: "sync", to: "api", label: "Import external email logs" }
      ]
    },
    scalability: [
      "Schema-based Isolation: Isolating tenants into separate database schemas simplifies scaling, allowing quick data migrations.",
      "Elasticsearch Cluster: Index and query customer contact records across tenants to maintain fast search speeds.",
      "Task Queuing: Process heavy contact list exports in the background via SQS to prevent server slowdowns."
    ],
    security: [
      {
        category: "Tenant Security",
        measures: [
          "Validate Tenant-ID headers for all incoming API requests.",
          "Restrict data access to the user's authenticated tenant account."
        ]
      },
      {
        category: "Third-party Integrations",
        measures: [
          "Encrypt user GSuite/Outlook OAuth credentials before saving to PostgreSQL.",
          "Log all tenant database updates for security audits."
        ]
      }
    ],
    roadmap: [
      {
        phase: "Phase 1: Multi-tenant Setup",
        duration: "Weeks 1 - 4",
        tasks: [
          "Setup PostgreSQL database schemas.",
          "Build tenant validation interceptor middleware.",
          "Create contacts tables and write basic APIs."
        ]
      },
      {
        phase: "Phase 2: Pipelines & Search",
        duration: "Weeks 5 - 8",
        tasks: [
          "Configure Elasticsearch indexing for contact records.",
          "Build kanban stages view for tracking deals.",
          "Connect contact records page to communication logs API."
        ]
      },
      {
        phase: "Phase 3: Mail Sync & Analytics",
        duration: "Weeks 9 - 12",
        tasks: [
          "Integrate GSuite and Outlook mail sync servers.",
          "Deploy reports dashboard to view team performance."
        ]
      }
    ]
  }
};

// Main dispatcher function
export function generateMockArchitecture(prompt: string): SystemArchitectureOutput {
  const normPrompt = prompt.toLowerCase();
  
  if (normPrompt.includes("interview") || normPrompt.includes("recruitment") || normPrompt.includes("hiring")) {
    return MOCK_ARCHITECTURES["ai-interview-platform"];
  }
  if (normPrompt.includes("uber") || normPrompt.includes("ride") || normPrompt.includes("taxi") || normPrompt.includes("food delivery") || normPrompt.includes("eats")) {
    return MOCK_ARCHITECTURES["build-uber"];
  }
  if (normPrompt.includes("airbnb") || normPrompt.includes("hotel") || normPrompt.includes("rental") || normPrompt.includes("booking")) {
    return MOCK_ARCHITECTURES["build-airbnb"];
  }
  if (normPrompt.includes("inventory") || normPrompt.includes("warehouse") || normPrompt.includes("stock")) {
    return MOCK_ARCHITECTURES["inventory-management-system"];
  }
  if (normPrompt.includes("hospital") || normPrompt.includes("medical") || normPrompt.includes("clinic") || normPrompt.includes("patient")) {
    return MOCK_ARCHITECTURES["hospital-management-system"];
  }
  if (normPrompt.includes("crm") || normPrompt.includes("sales") || normPrompt.includes("customer relation")) {
    return MOCK_ARCHITECTURES["crm-platform"];
  }
  
  // Custom prompt dynamic compilation
  return generateDynamicFallback(prompt);
}
