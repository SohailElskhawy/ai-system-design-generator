import { NextResponse } from "next/server";

/**
 * Endpoint to determine if the server has a GOOGLE_API_KEY configured.
 * Helps the client determine if a client-side API Key (BYOK) is strictly required.
 */
export async function GET() {
    return NextResponse.json({
        hasServerKey: !!process.env.GOOGLE_API_KEY
    });
}
