# SoulStudy — Claude Context

AI-powered study companion for Sterile Processing Technician (SPD) certification prep.
Built with Claude Code following Banyan Labs architecture standards.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + custom design tokens in `app/globals.css`
- **Auth + DB:** Firebase (Authentication + Firestore)
- **AI:** Anthropic Claude API — model: `claude-sonnet-4-6`
- **Testing:** Vitest + React Testing Library
- **Deploy:** Vercel

## Architecture — Dependency Direction

```
app/ (routes) → lib/services → lib/repositories → Firestore
                     ↓
              lib/integrations → Anthropic API / Firebase
```

- Route handlers and page components are thin — they call services, format results, return responses
- All business logic lives in `lib/services/`
- All Firestore queries live in `lib/repositories/`
- `lib/integrations/` holds SDK clients (Anthropic, Firebase init)
- `lib/models/` holds TypeScript types and Zod schemas
- `lib/utils/` holds pure functions — no side effects, no DB calls
- `hooks/` holds custom React hooks — no direct repository calls

## Key Files
- `app/globals.css` — design tokens (colors, fonts, spacing)
- `lib/integrations/firebase.ts` — Firebase app initialization
- `lib/integrations/anthropic.ts` — Anthropic SDK client
- `lib/prompts/study-assistant.md` — Askia system prompt

## AI Assistant — Askia
- Name: Askia
- Personality: warm but stern, like a big sister. Scholarly and encouraging.
- Scope: Sterile Processing Technician (SPD) certification content only
- Model: claude-sonnet-4-6
- Features: streaming chat, flashcard generation, quiz generation

## Design System
- Background: `#1A1210` (deep espresso)
- Primary: `#C8674E` (terracotta)
- Accent: `#D4A853` (amber gold)
- Plum: `#8B6EA4`
- Text: `#F5F0E8` (cream)
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Pill-shaped buttons/tabs, ✦ sparkle dividers, mudcloth pattern overlays

## Git Standards
See global `~/.claude/CLAUDE.md` for full Banyan Labs commit and branch conventions.
Branch format: `feature/BL-XXX-short-description`
Commit format: `feat(scope): description`

## Private Documentation
Internal project docs (not committed to GitHub) live in `docs/private/`:
- `ProjectBrief.md` — project overview, users, scope
- `TechSpecs.md` — full technical specifications and data models
- `BuildPlan.md` — revised sprint plan with CI/CD and testing integrated
- `UserStories.md` — development-ready user stories with acceptance criteria

## Instruction Library
Banyan Labs Claude instruction files live at:
`C:\Users\indig\Desktop\DevShop\Banyan-Labs\CLAUDE\`
These are already outside the git repo and are never committed.

Key prompts used in this project are documented in `docs/private/BuildPlan.md`.
