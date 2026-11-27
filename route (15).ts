import { aiEnabled, GEMINI_MODEL } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    app: "Scholar AI",
    storage: "browser-localStorage",
    database: false,
    aiConfigured: aiEnabled(),
    aiProvider: aiEnabled() ? "Google Gemini" : "offline-fallback",
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  });
}
