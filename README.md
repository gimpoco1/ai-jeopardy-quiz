# AI Quiz Board

Generate a Jeopardy-style 5×6 board of questions from any topic using OpenAI's GPT-4 model.

https://www.youtube.com/watch?v=twQKO6x41lk

## Quickstart

```bash
pnpm i   # or npm i 
cp .env.example .env.local  # add your OPENAI_API_KEY
pnpm dev
```

Open http://localhost:3000

### Notes
- If `OPENAI_API_KEY` is not set, the API falls back to a deterministic mock so you can develop offline.
- The prompt asks for JSON only and we validate with `zod`.
- Questions are shown when you click a cell; 

## Project Layout

- `app/` — Next.js App Router UI + API route
- `app/api/generate/route.ts` — calls OpenAI (or mock) to produce the board
- `lib/prompt.ts` — tightly scoped prompt
- `lib/types.ts` — TypeScript types
- `tailwind` — used for styling, with colors matching the reference screenshot

## Roadmap
- Answers & judging rubric in the payload
- Players and scoring (tap a player after reveal to assign points)
- Host controls: lock/unlock, reveal timer
- Persist boards, export/import as JSON
- Audio/visual polish
```

