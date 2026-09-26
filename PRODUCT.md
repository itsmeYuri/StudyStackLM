# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated from the user's deployment constraints: Next.js with TypeScript on Vercel, Supabase for authentication, PostgreSQL, Storage, Realtime, and Row Level Security, and the Gemini API for extraction-assisted generation and structured study materials.

## Users

Primary users are students studying with classmates. A student creates a study group, invites other students, contributes class material, and practices from resources generated from the group's shared sources.

Future users may include teachers and school administrators, but teacher assignment workflows and institution administration are outside the first-release assumptions.

## Product Purpose

StudyStackLM turns a group's lesson files into shared, source-grounded study activities. Members upload PPTX, PDF, DOCX, or text-based reviewers, then generate summaries, condensed slide decks, flashcards, quizzes, and practice tests. Every member can use the shared generated material while attempts, answers, mastery, and progress remain personal.

Success means a new group can upload a lesson and begin a useful, trustworthy study activity within minutes, without manually rewriting the lesson.

## Positioning

StudyStackLM combines a shared class workspace with source-grounded study generation. Its central mechanism is a reusable group knowledge base: one uploaded lesson can become several study formats, every generated item retains a link to its source, and the whole group can practice from the same material.

## Operating Context

- A student creates a group and receives a join code and invitation link.
- Members join the group and can upload supported lesson files when their group role permits it.
- Uploaded sources are processed into page- or slide-level text chunks.
- A member chooses one or more sources, a study format, coverage, difficulty, and length.
- The generated material becomes a draft. Its creator reviews and publishes it to the group.
- Members study flashcards or take quizzes independently. The system stores personal attempts and progress.
- Members can report inaccurate generated content. Owners and moderators can archive sources and materials.

## Capabilities and Constraints

Confirmed requirements:

- Product name: StudyStackLM.
- Student-created groups with join links or codes.
- Shared source uploads and shared generated study materials.
- Generated reviewer, slide deck, flashcards, quiz, and practice test.
- Quiz question types: multiple choice, true/false, fill in the blank, and enumeration.
- Deployable on Vercel with Supabase as the application backend.

Assumptions made because structured product questions were unavailable:

- The first release is student-led and does not include teacher gradebooks or institution administration.
- Shared quizzes use individual attempts; synchronized live quiz rooms are deferred.
- Google Gemini is the AI provider, using a model available on the Gemini API free tier and accessed only from server-side code.
- Uploaded source limits begin at 25 MB per file and 200 pages/slides per source, then are adjusted using production usage data.
- Generated content requires creator review before group publication.
- Group roles are owner, moderator, and member.
- English is the first-generation language, with source-language preservation when reliably detected.

Technical constraints:

- Never expose the Gemini key or Supabase service-role key to the browser.
- Enforce all group and user data access with Supabase Row Level Security.
- Treat uploaded files and extracted content as untrusted input.
- Run long document processing and generation as durable background jobs rather than depending on one browser request.
- Keep generated questions traceable to exact source chunks.

Open decisions:

- Free-tier usage limits, paid plans, and billing provider.
- Whether any member may publish or publication requires owner/moderator approval.
- Whether groups can be discoverable; the first-release plan assumes private groups only.
- Whether teacher-owned classes, assignments, deadlines, and grade export become the next product track.

## Brand Commitments

- Name: StudyStackLM.
- Voice: encouraging, clear, focused, and academically responsible.
- The product should feel like a capable shared study desk rather than a school administration portal.

## Evidence on Hand

No logo, visual assets, user research, testimonials, pricing evidence, school partnerships, or production content currently exist. Future work must not fabricate these.

## Product Principles

1. Sources remain visible. Generated facts and questions point back to the lesson that supports them.
2. Share knowledge, preserve privacy. Group resources are collaborative; attempts and progress belong to each student.
3. Review before publishing. AI output is editable draft material, not unquestionable authority.
4. Reach useful study quickly. Upload-to-practice time is a primary product metric.
5. Design for study sessions. Interfaces emphasize focus, retrieval practice, feedback, and resuming progress.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Every study mode must work by keyboard, preserve visible focus, support screen readers, avoid color-only meaning, respect reduced motion, and provide readable feedback for correct and incorrect responses.
