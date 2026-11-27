import { NextResponse } from "next/server";
import { aiEnabled, GEMINI_MODEL, geminiGenerate } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST() {
  if (!aiEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        provider: "Google Gemini",
        message: "GEMINI_API_KEY is missing. Add it in Netlify environment variables and redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const response = await geminiGenerate({
      system: "You are a connection test. Reply with a short confirmation only.",
      parts: [{ text: "Reply exactly: Scholar AI connection successful." }],
      temperature: 0,
      maxOutputTokens: 40,
      timeoutMs: 20_000,
    });
    return NextResponse.json({ ok: true, configured: true, provider: "Google Gemini", model: GEMINI_MODEL, message: response });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini connection failed.";
    return NextResponse.json(
      { ok: false, configured: true, provider: "Google Gemini", model: GEMINI_MODEL, message },
      { status: 502 }
    );
  }
}
