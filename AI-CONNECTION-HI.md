# Scholar AI — AI connection (Netlify)

Project already calls its server-side API routes from the frontend. Do not put a Gemini key in browser code and do not use a `NEXT_PUBLIC_` prefix.

## Enable real Gemini answers
1. Open Google AI Studio and create a Gemini API key.
2. In Netlify, open **Site configuration → Environment variables**.
3. Add `GEMINI_API_KEY` with the key as its value. Add it to the Production deploy context (and Deploy Previews too, if needed).
4. Keep `GEMINI_MODEL` as `gemini-flash-latest` (optional; this is the default).
5. Trigger a fresh deploy. Environment-variable changes do not affect an already-running deployment.
6. Open `https://YOUR-SITE.netlify.app/api/health`. It should show `aiConfigured: true`.
7. Send a POST request to `https://YOUR-SITE.netlify.app/api/ai-test` with an empty JSON body. A successful result has `ok: true`.

## No-key demo mode
The app still has a deterministic offline fallback for flashcards, quizzes, study plans, and doubt-helper output. This keeps the screens usable for a presentation, but it is not a live generative AI model. The `/api/health` endpoint reports which mode is active.

## Security
Never paste the key into frontend files, Git, screenshots, or public chat. Keep it only in Netlify environment variables or a local `.env.local` file that is excluded from Git.
