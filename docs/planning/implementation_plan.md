# SoulStudy — Implementation Plan

**Project:** AI-powered study companion for Sterile Processing Technician (SPD) certification
**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Firebase (Auth + Firestore) · Anthropic Claude API
**Aesthetic:** Afrocentric · Calming · Celestial · Warm dark palette
**AI Assistant:** Askia — warm, stern, scholarly. Like your big sister.

---

## Before Any Code — Required Setup

You need three things from external consoles before development starts.
Complete all three and give them to Claude Code to proceed.

### 1. GitHub Repo
- Go to github.com → New repository
- Name: `soulstudy`
- Visibility: **Public**
- No README, no .gitignore (handled in code)
- Copy the repo URL

### 2. Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project → name: `soulstudy` → disable Google Analytics
3. **Build → Firestore Database** → Create database → Start in test mode → pick a location
4. **Build → Authentication** → Get started → enable Email/Password
5. **Project Settings (gear icon)** → Your apps → click `</>` web icon → register as `soulstudy`
6. Copy the entire `firebaseConfig` object — you need all 7 values:
   ```
   apiKey
   authDomain
   projectId
   storageBucket
   messagingSenderId
   appId
   ```

### 3. Anthropic API Key
- Go to [console.anthropic.com](https://console.anthropic.com)
- API Keys → Create Key
- Copy it immediately (it won't show again)
- Format: `sk-ant-api03-...`

---

## Environment Variables

These go in `.env.local` at the project root (never committed to git):

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Firebase (client-side — NEXT_PUBLIC_ prefix required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Routing, SSR, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Auth | Firebase Authentication | Email/password user accounts |
| Database | Firebase Firestore | User data, decks, quiz history |
| AI | Anthropic Claude API (claude-sonnet-4-6) | Askia — study assistant |
| Testing | Vitest + React Testing Library | Unit + component tests |
| CI/CD | GitHub Actions | Lint, test, deploy on push |
| Deployment | Vercel | Live hosted app |
| Containers | Docker + docker-compose | Dev + production containers |

---

## Project Structure

```
soulstudy/
├── app/                          # Next.js App Router — thin routing only
│   ├── (auth)/                   # Route group — login/signup pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/              # Route group — protected pages
│   │   ├── layout.tsx            # Auth guard + sidebar layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── chat/page.tsx         # Askia AI chat
│   │   ├── flashcards/page.tsx   # Flashcard decks
│   │   └── quiz/page.tsx         # Quiz mode
│   ├── api/                      # API routes (server-side)
│   │   ├── chat/route.ts         # Askia streaming chat
│   │   ├── flashcards/route.ts   # AI flashcard generation
│   │   └── quiz/route.ts         # AI quiz generation
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Tailwind + custom theme tokens
├── components/                   # Reusable UI components
│   ├── ui/                       # Base components (Button, Card, Input, Badge, Modal)
│   ├── layout/                   # Sidebar, Header, PageWrapper
│   ├── chat/                     # ChatWindow, MessageBubble, ChatInput
│   ├── flashcards/               # FlashCard, DeckList, DeckCard
│   └── quiz/                     # QuizQuestion, QuizResult, ProgressBar
├── lib/                          # Business logic — no UI imports
│   ├── services/                 # Feature logic
│   │   ├── chat.service.ts       # Askia conversation orchestration
│   │   ├── flashcard.service.ts  # Deck CRUD + AI generation
│   │   └── quiz.service.ts       # Quiz state + scoring
│   ├── repositories/             # All Firestore queries
│   │   ├── user.repository.ts
│   │   ├── deck.repository.ts
│   │   └── quiz.repository.ts
│   ├── integrations/
│   │   ├── anthropic.ts          # Anthropic SDK client
│   │   └── firebase.ts           # Firebase app init
│   ├── models/                   # TypeScript types + Zod schemas
│   │   ├── user.ts
│   │   ├── flashcard.ts
│   │   └── quiz.ts
│   ├── utils/                    # Pure helper functions
│   └── prompts/
│       └── study-assistant.md    # Askia system prompt
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Firebase auth state
│   ├── useChat.ts                # Chat state + streaming
│   └── useFirestore.ts           # Firestore CRUD helpers
├── docs/
│   └── planning/                 # This file + aesthetic guide + schedule
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions — lint, test, deploy
├── Dockerfile                    # Production container
├── docker-compose.yml            # Development container
├── CLAUDE.md                     # AI context for this project
├── README.md                     # Setup + architecture docs
└── .env.example                  # Template (no real values)
```

---

## Dependency Direction (never break this)

```
app/ routes → lib/services → lib/repositories → Firestore
                    ↓
             lib/integrations → Anthropic API / Firebase
```

- Routes and components never call repositories directly
- Services never import from `app/`
- `lib/utils` has zero dependencies on application code

---

## Sprint Schedule — Day by Day

Each day has a clear scope. At the end of each day: **commit → push → PR → merge → delete branch**.
Do not carry unfinished work into the next day's branch.

---

### ✅ Day 1 — March 24 — Project Foundation
**Branch:** `feature/BL-001-project-setup` *(merged)*
- [x] Fresh Next.js 15 project initialized
- [x] Firebase + Anthropic SDK + Zod + Vitest installed
- [x] SoulStudy design system tokens in `app/globals.css`
- [x] `.env.local` configured (Firebase + Anthropic)
- [x] CLAUDE.md, `.env.example`, planning docs added
- [x] GitHub repo live at `github.com/IndigoCollier/soulstudy`

---

### ✅ Day 2 — March 25 — UI Component Library
**Branch:** `feature/BL-002-ui-components` *(merged)*
- [x] `components/ui/Button.tsx` — variants: primary, secondary, ghost
- [x] `components/ui/Card.tsx` — surface card with optional glow
- [x] `components/ui/Input.tsx` — styled text input with label + rightElement support
- [x] `components/ui/Badge.tsx` — pill label for categories/status
- [x] `components/ui/Modal.tsx` — overlay modal with backdrop
- [x] All components typed with TypeScript props
- [x] `__tests__/components/ui/Button.test.tsx` — 9 test cases passing

---

### ✅ Day 3 — March 26 — Firebase Auth + CI/CD + Docker
**Branch:** `feature/BL-003-firebase-auth` *(merged)*
- [x] `lib/integrations/firebase.ts` — Firebase app init with CI null guard
- [x] `lib/models/user.ts` — User type + LoginSchema + SignUpSchema (Zod)
- [x] `hooks/useAuth.ts` — auth state hook
- [x] `app/(auth)/login/page.tsx` — login page UI
- [x] `app/(auth)/signup/page.tsx` — signup page UI
- [x] `app/(auth)/forgot-password/page.tsx` — password reset flow
- [x] `.github/workflows/ci.yml` — GitHub Actions (lint, tsc, test, build)
- [x] `Dockerfile` + `docker-compose.yml` — multi-stage build
- [x] `__tests__/lib/models/user.test.ts` — 8 test cases passing

---

### ✅ Day 4 — March 26-27 — Layout + Auth Guard
**Branch:** `feature/BL-004-layout` *(merged)*
- [x] `app/(dashboard)/layout.tsx` — auth guard (redirects if not logged in)
- [x] `app/(dashboard)/dashboard/page.tsx` — dashboard shell
- [x] `components/layout/Sidebar.tsx` — nav links with active state
- [x] `components/layout/Header.tsx` — time-based greeting + sign out
- [x] `components/layout/PageWrapper.tsx` — consistent page padding/structure
- [x] `app/page.tsx` — root redirect based on auth state
- [x] `app/globals.css` — fixed Tailwind v4 + next/font Google Fonts conflict
- [x] `__tests__/components/layout/DashboardLayout.test.tsx` — 3 auth guard tests

---

### ⬜ Day 5 — March 27 — Askia Backend
**Branch:** `feature/BL-005-askia-backend`
- [ ] `lib/models/chat.ts` — ChatMessage + Conversation Zod schemas
- [ ] `lib/prompts/study-assistant.md` — Askia system prompt (SPD-focused, big sister tone)
- [ ] `lib/services/chat.service.ts` — build messages array, call Anthropic
- [ ] `lib/repositories/conversation.repository.ts` — save/get Firestore conversations
- [ ] `app/api/chat/route.ts` — streaming POST handler
- [ ] `__tests__/lib/models/chat.test.ts` — schema tests
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Day 6 — March 28 — Askia Chat UI + Mobile Responsiveness
**Branch:** `feature/BL-006-askia-chat-ui`
- [ ] `components/chat/ChatWindow.tsx` — scrollable message thread
- [ ] `components/chat/MessageBubble.tsx` — user + Askia message styles
- [ ] `components/chat/ChatInput.tsx` — input bar with send button
- [ ] `components/chat/StreamingIndicator.tsx` — typing animation
- [ ] `hooks/useChat.ts` — chat state + streaming handler
- [ ] `app/(dashboard)/chat/page.tsx` — full chat page
- [ ] Sidebar hidden on mobile, bottom nav shown on small screens
- [ ] Layout tested at 375px / 768px / 1280px
- [ ] Conversation history loaded from Firestore
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Day 7 — March 30 — Flashcards
**Branch:** `feature/BL-006-flashcards`
- [ ] `lib/models/flashcard.ts` — Flashcard + Deck types + Zod schemas
- [ ] `lib/repositories/deck.repository.ts` — Firestore CRUD for decks
- [ ] `lib/services/flashcard.service.ts` — deck logic + AI generation
- [ ] `app/api/flashcards/route.ts` — AI flashcard generation endpoint
- [ ] `components/flashcards/FlashCard.tsx` — flip animation card
- [ ] `components/flashcards/DeckList.tsx` — list of saved decks
- [ ] `app/(dashboard)/flashcards/page.tsx` — flashcards page
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Day 8 — March 31 — Quiz Mode
**Branch:** `feature/BL-007-quiz`
- [ ] `lib/models/quiz.ts` — Quiz + Question types + Zod schemas
- [ ] `lib/repositories/quiz.repository.ts` — save/load quiz history
- [ ] `lib/services/quiz.service.ts` — quiz state + scoring logic
- [ ] `app/api/quiz/route.ts` — AI quiz generation endpoint
- [ ] `components/quiz/QuizQuestion.tsx` — multiple choice question UI
- [ ] `components/quiz/QuizResult.tsx` — score summary screen
- [ ] `components/quiz/ProgressBar.tsx` — question progress indicator
- [ ] `app/(dashboard)/quiz/page.tsx` — quiz page
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Day 9 — April 1 — Dashboard
**Branch:** `feature/BL-008-dashboard`
- [ ] `app/(dashboard)/page.tsx` — full dashboard (replaces shell from Day 4)
- [ ] Personalized greeting by time of day + user name
- [ ] Daily Afrocentric/motivational quote
- [ ] Study stats — quizzes taken, flashcards reviewed, streak
- [ ] Quick action cards linking to chat, flashcards, quiz
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Day 10 — April 2 — Docker
**Branch:** `feature/BL-009-docker`
- [ ] `Dockerfile` — multi-stage production build
- [ ] `docker-compose.yml` — local development setup
- [ ] `.dockerignore` — exclude node_modules, .next, .env files
- [ ] Test: `docker build` completes, `docker-compose up` runs the app
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Day 11 — April 3 — CI/CD + Tests
**Branch:** `feature/BL-010-cicd-tests`
- [ ] `.github/workflows/ci.yml` — lint + test + build on every push
- [ ] Unit tests for `chat.service.ts` and `quiz.service.ts`
- [ ] Component test for `Button.tsx` or `Card.tsx`
- [ ] Verify all tests pass locally with `npm test`
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Day 12 — April 4 — README + Deploy
**Branch:** `feature/BL-011-docs-deploy`
- [ ] `README.md` — setup instructions, architecture overview, screenshots, Docker commands
- [ ] Deploy to Vercel — connect GitHub repo, set env vars in Vercel dashboard
- [ ] Add live URL to README
- [ ] Final review of all capstone requirements checklist
- [ ] End of day: commit → push → PR → merge

---

### ⬜ Days 13-14 — April 5-6 — Buffer
**No branch** — reserved for polish, bug fixes, and video demo prep.
Use these days to catch up on anything that slipped or to record the 5-10 min walkthrough video.

---

## Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#1A1210` | Page background |
| `--color-surface` | `#2A2220` | Cards, panels |
| `--color-primary` | `#C8674E` | Buttons, active states |
| `--color-accent` | `#D4A853` | Gold highlights, badges |
| `--color-plum` | `#8B6EA4` | Accents, links |
| `--color-text` | `#F5F0E8` | Primary text (cream) |
| `--color-muted` | `#B8A99A` | Secondary text (warm sand) |
| `--color-success` | `#7A9E7E` | Correct answers |

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Mono/Timers:** Space Mono

### UI Conventions
- Pill-shaped buttons and tabs (rounded-full or rounded-2xl)
- Mudcloth-inspired low-opacity background patterns
- ✦ sparkle dividers between sections
- 300ms ease-in-out transitions
- Warm-to-purple gradients (terracotta → plum)

---

## Capstone Requirements Checklist

| Requirement | How It's Met |
|------------|-------------|
| Git Workflow | Feature branches per phase, conventional commits, PRs per feature |
| Docker | `Dockerfile` (production) + `docker-compose.yml` (dev) |
| AI-Assisted Development | Built entirely with Claude Code — documented in CLAUDE.md |
| Documentation | Comprehensive README + CLAUDE.md |
| CI/CD | GitHub Actions — lint + test + build on every push |
| Reusable Components | `components/ui/` — Button, Card, Input, Badge, Modal with TypeScript props |
| AI Integration | Askia via Anthropic Claude API — chat, flashcard gen, quiz gen |
| UI/UX | Responsive layout — mobile, tablet, desktop |
| Testing | Vitest unit tests (services) + React Testing Library (components) |

---

## Git Branch Strategy

```
main
├── feature/BL-001-project-setup   Day 1   ✓ MERGED
├── feature/BL-002-ui-components   Day 2   ✓ MERGED
├── feature/BL-003-firebase-auth   Day 3   ✓ MERGED
├── feature/BL-004-layout          Day 4   ✓ MERGED
├── feature/BL-005-askia-backend   Day 5   ← NEXT
├── feature/BL-006-askia-chat-ui   Day 6
├── feature/BL-006-flashcards      Day 7
├── feature/BL-007-quiz            Day 8
├── feature/BL-008-dashboard       Day 9
├── feature/BL-009-docker          Day 10
├── feature/BL-010-cicd-tests      Day 11
└── feature/BL-011-docs-deploy     Day 12
```

Commit format: `feat(scope): description` — see global CLAUDE.md for full standards.

---

## Deliverables Checklist

- [x] GitHub repository with clean commit history ✓ (started)
- [ ] Dockerfile and docker-compose.yml with documentation
- [ ] Live deployed application (Vercel)
- [ ] Comprehensive README with screenshots, setup instructions, architecture overview
- [ ] CLAUDE.md documenting project for AI assistants
- [ ] Video demo (5-10 minutes) walking through the app and code structure

---

## Session Log

| Date | Work Done | Next |
|------|-----------|------|
| 2026-03-24 | Project initialized, dependencies installed, design system configured, GitHub repo set up, `BL-001` merged | UI component library |
| 2026-03-25 | UI component library (Button, Card, Input, Badge, Modal), Button tests, `BL-002` merged | Firebase Auth |
| 2026-03-26 | Firebase Auth, forgot password, CI/CD (GitHub Actions), Docker, auth tests, `BL-003` merged | Layout + auth guard |
| 2026-03-26-27 | Dashboard layout, auth guard, Sidebar, Header, PageWrapper, root redirect, Tailwind/font CSS fix, `BL-004` merged | Askia backend |

---

*Last updated: 2026-03-24 — Built with Claude Code (claude-sonnet-4-6)*
