import { GoogleGenAI } from "@google/genai";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompts";
import { SystemDesignSchema } from "./schema";

/**
 * Strips markdown code fences (like ```json ... ```) that the LLM may wrap the output in,
 * returning a clean JSON string for parsing.
 */
function cleanJsonString(str: string): string {
    return str.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
}

/**
 * Generates a complete system design blueprint using Gemini.
 * It uses the provided API key (supporting BYOK) and implements a fallback model sequence
 * to guarantee reliability even if the primary model is busy/unavailable.
 * It also restricts token usage by setting maxOutputTokens and temperature bounds.
 */
export async function generateSystemDesign(prompt: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });
    let lastError: unknown = null;

    // Ordered sequence of fallback models
    const modelsToTry = Array.from(new Set([
        process.env.GOOGLE_MODEL || "gemini-3.5-flash",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite"
    ]));

    const errors: string[] = [];

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini SDK] Attempting generation with model: ${modelName}`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: buildUserPrompt(prompt),
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    responseMimeType: "application/json",
                    responseSchema: SystemDesignSchema.toJSONSchema() as unknown as Record<string, unknown>,
                    // // Token management limits:
                    maxOutputTokens: 3500, // High enough for full systems design, low enough to protect wallets
                    temperature: 0.2, // Reduces creative fluff and focuses on concise data
                },
            });

            if (!response.text) {
                throw new Error(`Empty text returned from model ${modelName}`);
            }

            const cleanText = cleanJsonString(response.text);
            const rawJson = JSON.parse(cleanText);
            const systemDesign = SystemDesignSchema.parse(rawJson);

            console.log(`[Gemini SDK] Success generating architecture with model ${modelName}`);
            return systemDesign;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[Gemini SDK] Attempt failed with model ${modelName}:`, message);
            errors.push(`${modelName}: ${message}`);
            lastError = error;
        }
    }

    console.error("[Gemini SDK] All model generation attempts failed:", errors.join(" | "));
    throw lastError || new Error(`Failed to generate system design with all configured models. Errors: ${errors.join("; ")}`);
}