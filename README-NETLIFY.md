# Scholar AI — Netlify deployment (no database)

This is a full-stack Next.js App Router application. Deploy it as Next.js on Netlify; do not use static export or an SPA redirect. Netlify's managed Next.js adapter serves the `/api/*` route handlers.

## Build settings
- Build command: `npm run build`
- Publish directory: `.next`
- Node.js: `22`

## Environment variables
Only one variable is required for live Gemini AI:

| Name | Required for live AI | Value |
|---|---:|---|
| `GEMINI_API_KEY` | Yes | Your Google AI Studio Gemini API key |
| `GEMINI_MODEL` | No | `gemini-flash-latest` (default) |

Add the key in Netlify **Site configuration → Environment variables**, then redeploy. Keep it server-side: never use `NEXT_PUBLIC_GEMINI_API_KEY` and never commit the key.

## Database-free operation
- No PostgreSQL or Supabase connection is required.
- User-facing browser data is intended to remain in browser storage; it is not cloud-synced across devices.
- If the Gemini key is absent or Gemini is temporarily unavailable, supported generation flows use the built-in deterministic fallback. This is demo/offline output, not a live AI response.

## Verify after deploy
1. Open `/api/health`. Confirm `ok: true`; `aiConfigured` tells whether a Gemini key is present.
2. Send `POST /api/ai-test` with `{}`. It verifies the Gemini connection without exposing the key.
3. Test Ask AI, Generate, Quiz and Study Plan from the website.

See `AI-CONNECTION-HI.md` for the short Hindi setup steps.
