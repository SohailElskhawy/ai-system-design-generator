import { generateSystemDesign } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Route handler for the system architecture generator API.
 * Validates request input, extracts the optional client-side API key (BYOK),
 * manages size constraints, and handles errors from the Gemini SDK or Zod parser.
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Parse request body safely
        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
        }

        const { prompt } = body;

        // 2. Security validation: validate prompt presence and size limits (max 2000 chars)
        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return NextResponse.json({ error: "Prompt is required and must be a non-empty string." }, { status: 400 });
        }

        if (prompt.length > 2000) {
            return NextResponse.json({ 
                error: "Prompt is too long. Please restrict your description to under 2,000 characters to prevent API exploitation and conserve tokens." 
            }, { status: 400 });
        }

        // 3. BYOK Validation: Check header key first, then fall back to server env
        const clientApiKey = req.headers.get("x-gemini-api-key");
        const apiKey = clientApiKey || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ 
                error: "Gemini API Key is missing. Please provide your own API key in the settings panel (BYOK) or set the server environment variable." 
            }, { status: 400 });
        }

        // 4. Generate system design using SDK with schema constraints
        const systemDesign = await generateSystemDesign(prompt, apiKey);
        
        return NextResponse.json({ systemDesign });

    } catch (error) {
        console.error("[Generate API Route Handler Error]:", error);

        // Handle Zod schema parsing/validation errors
        if (error instanceof ZodError) {
            return NextResponse.json({ 
                error: "Failed to construct a compliant blueprint schema. The model's response structure was invalid.",
                details: error.issues
            }, { status: 502 });
        }

        // Handle standard API errors from Gemini SDK safely
        const errObj = error as Record<string, unknown> | null | undefined;
        const status = (errObj && typeof errObj.status === "number") ? errObj.status : 500;
        const message = error instanceof Error ? error.message : "An unexpected error occurred while generating the system design architecture.";

        return NextResponse.json({ error: message }, { status });
    }
}