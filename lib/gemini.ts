import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateText(prompt: string) {
    const interaction = await ai.interactions.create({
        model: process.env.GOOGLE_MODEL || "gemini-3.5-flash",
        input: prompt,
        generation_config: {
            temperature: 0.7,
            max_output_tokens: 256,
        },
    });
    return interaction.output_text
}