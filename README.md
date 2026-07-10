# ArchAI — Interactive System Design & Architecture Generator

An interactive, AI-powered software system design generator that transforms high-level product descriptions into comprehensive, production-ready system architecture blueprints in seconds. Powered by Next.js, React 19, Tailwind CSS v4, Zod schema validation, and the Google Gemini API.

![ArchAI System Design Generator Dashboard](screenshots/1.png)

---

## 📖 Table of Contents
1. [Key Features](#-key-features)
2. [Project Architecture Flow](#-project-architecture-flow)
3. [Tech Stack](#-tech-stack)
4. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running Locally](#running-locally)
   - [Building for Production](#building-for-production)
5. [How to Use](#-how-to-use)
6. [Blueprint Specifications](#-blueprint-specifications)
7. [Contributing & License](#-contributing--license)

---

## ✨ Key Features

- **💡 Dynamic Blueprint Synthesis**: Input any product idea or vision (up to 2,000 characters) and receive a comprehensive, structured architectural design.
- **📊 Real-time Mermaid Diagrams**: Renders interactive, modern visual topology models (sequence flows or component architecture) directly in the browser using Mermaid.js.
- **🔑 Bring Your Own Key (BYOK)**: Securely configure your own Gemini API Key directly in the UI settings panel (saved in your browser's local storage) to bypass shared limits.
- **🔄 Robust Failover Engine**: If the primary Gemini model is throttled or unavailable, the backend automatically transitions through a fallback model sequence (e.g. `gemini-3.5-flash` ➡️ `gemini-2.5-flash` ➡️ `gemini-2.0-flash` ➡️ `gemini-2.0-flash-lite`) to guarantee reliable generation.
- **📋 Schema-verified Structuring**: Leverages Zod schema validation to ensure the LLM's response matches a strict structural contract with zero empty arrays or missing descriptions.
- **💾 One-Click Markdown Export**: Downloader feature that converts the entire generated system architecture blueprint into a clean, fully formatted markdown document for easy integration with your project documentation.
- **🎨 Premium Dark Aesthetics**: Designed with a sleek, minimalist Vercel-like dark theme using Tailwind CSS v4, custom grid backgrounds, subtle glow effects, and Framer Motion animations.

---

## 🛠️ Project Architecture Flow

The following sequence shows how a user prompt gets processed, validated, and rendered:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Interface (Client)
    participant API as Next.js API Route (/api/generate)
    participant Gemini as Google Gemini API
    participant Zod as Zod Schema Validator
    
    User->>API: POST /api/generate (prompt & optional API Key)
    API->>API: Validate prompt length & API key availability
    API->>Gemini: generateContent (model sequence fallback + strict responseSchema)
    Gemini-->>API: Returns structured JSON response
    API->>Zod: Validate JSON against SystemDesignSchema
    Zod-->>API: Passes validation / returns typed structure
    API-->>User: Returns verified system blueprint
    User->>User: Render sections (Framer Motion) & diagrams (Mermaid.js)
```

---

## 💻 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [@google/genai SDK](https://github.com/google/generative-ai-js)
- **Visuals / Diagrams**: [Mermaid.js v11](https://mermaid.js.org/)
- **Validation**: [Zod v4](https://zod.dev/)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** or **yarn** / **pnpm** / **bun**

### Installation
Clone the repository and install the project dependencies:
```bash
git clone https://github.com/your-username/ai-system-design-generator.git
cd ai-system-design-generator
npm install
```

### Environment Variables
Create a `.env` file in the root directory (or rename the existing one) and configure the following environment variables:
```env
# Google Gemini API Key (Required for backend-managed generation)
GOOGLE_API_KEY=your_gemini_api_key_here

# Targeted Gemini Model (Optional, defaults to gemini-2.5-flash / gemini-3.5-flash)
GOOGLE_MODEL=gemini-3.5-flash
```

### Running Locally
Run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production
To build the application for deployment:
```bash
npm run build
npm run start
```

---

## 🎯 How to Use

1. **Configure API Key (Optional)**: Click the **Settings** gear icon in the top right navbar. Paste your Gemini API key there to use client-side authentication (BYOK). If omitted, the application falls back to the backend's environment variables.
2. **Describe Your Vision**: In the prompt input container, write a description of your application (e.g. *"A real-time ride-sharing platform similar to Uber with high concurrency, geo-queries, and caching"*).
3. **Generate Architecture**: Press Enter or click the **Generate Blueprint** button.
4. **Analyze & Interact**: Use the sticky sidebar navigation on the left to jump between different components:
   - Expand database tables to see fields, indices, and types.
   - Inspect API endpoints with pre-generated realistic mock request/response JSONs.
   - View the dynamic system topology diagram.
5. **Export to Markdown**: Click the **Export Markdown** button in the sidebar to download a styled markdown file containing the entire document.

---

## 📝 Blueprint Specifications

Every generated system architecture blueprint is structured with the following key components:

1. **Executive Summary**: Core metadata details containing complexity, reading time, target audience, estimated infrastructure cost, database strategy, and justifications.
2. **Requirements**: 5+ detailed functional and non-functional requirements.
3. **Actors & Use Cases**: Detailed breakdown of system actors and actionable use case flows.
4. **Recommended Tech Stack**: Curated technologies for frontend, backend, database, DevOps, caching, and queuing, paired with engineering justifications.
5. **Database Schema Design**: 4-6 database tables specifying data types, keys (PK/FK), nullability, and field purposes.
6. **REST API Documentation**: 6-8 fully specified endpoints with complete, non-placeholder JSON payload mocks.
7. **System Architecture**: Mermaid topology models representing data flow, components, and CDN/Compute/DB nodes.
8. **Scalability & Security**: Actionable lists of compliance measures and scaling actions.
9. **Development Roadmap**: A step-by-step milestone timeline with tasks and estimated durations.
