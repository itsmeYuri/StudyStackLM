# StudyStackLM

StudyStackLM is a collaborative study workspace that turns shared class lessons into cited reviewers, flashcards, slide decks, quizzes, and practice tests.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add Supabase credentials plus a Gemini API key from Google AI Studio.
3. Start Supabase locally with `npx supabase start` or link a hosted project.
4. Apply migrations with `npx supabase db reset` locally or `npx supabase db push` when linked.
5. Start the app with `npm run dev`.

StudyStackLM requires Supabase credentials for authentication, groups, uploads, drafts, and persistent study activity. It does not substitute demo content when the backend is unavailable.

## Deploy to Vercel

Import this repository into Vercel and configure every variable listed in `.env.example`. Add the production URL to Supabase Auth redirect URLs, apply the database migration, and deploy. Server secrets must never use the `NEXT_PUBLIC_` prefix.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

See `STUDYSTACKLM_PLAN.md` for architecture, security rules, release criteria, and later product phases.
