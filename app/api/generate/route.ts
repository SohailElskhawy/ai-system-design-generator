import { generateText } from "@/lib/gemini";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    const text = await generateText(prompt);
    return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
    });
}