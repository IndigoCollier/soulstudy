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

## Features

### Phase 1 — Foundation
- [ ] Fresh Next.js project initialized
- [ ] Firebase configured (Auth + Firestore)
- [ ] Tailwind theme tokens defined (colors, fonts, spacing)
- [ ] Base UI component library (Button, Card, Input, Badge, Modal)
- [ ] Firebase Auth — signup, login, logout
- [ ] Auth guard on dashboard routes
- [ ] Sidebar + layout shell

### Phase 2 — Askia (AI Chat)
- [ ] Anthropic SDK integration (`lib/integrations/anthropic.ts`)
- [ ] Askia system prompt (warm, stern, SPD-focused)
- [ ] Streaming chat API route (`app/api/chat/route.ts`)
- [ ] Chat service (`lib/services/chat.service.ts`)
- [ ] Chat UI — ChatWindow, MessageBubble, ChatInput components
- [ ] Conversation history saved to Firestore

### Phase 3 — Flashcards
- [ ] Flashcard + Deck data models (Zod schemas)
- [ ] Firestore repository — CRUD for decks
- [ ] AI flashcard generation (Askia generates cards from a topic)
- [ ] FlashCard flip animation component
- [ ] Deck management UI

### Phase 4 — Quiz Mode
- [ ] Quiz data model
- [ ] AI quiz generation (multiple choice, from SPD topics)
- [ ] Quiz flow UI — question → answer → result
- [ ] Score saved to Firestore
- [ ] Quiz history on dashboard

### Phase 5 — Dashboard
- [ ] Personalized greeting (time of day + user name)
- [ ] Daily study quote (Afrocentric/motivational)
- [ ] Study stats — streak, quizzes taken, flashcards reviewed
- [ ] Quick action cards

### Phase 6 — Infrastructure
- [ ] Dockerfile (production)
- [ ] docker-compose.yml (development)
- [ ] GitHub Actions CI — ESLint, Vitest, build check
- [ ] Unit tests — services + critical utils
- [ ] Component tests — at least one (Button or Card)
- [ ] README with setup instructions + architecture overview
- [ ] CLAUDE.md with project context
- [ ] Deploy to Vercel

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
main                    # production — only merged PRs
├── feature/BL-001-project-setup
├── feature/BL-002-firebase-auth
├── feature/BL-003-ui-components
├── feature/BL-004-askia-chat
├── feature/BL-005-flashcards
├── feature/BL-006-quiz-mode
├── feature/BL-007-dashboard
└── feature/BL-008-docker-cicd
```

Commit format: `feat(scope): description` — see global CLAUDE.md for full standards.

---

## Deliverables Checklist

- [ ] GitHub repository with clean commit history
- [ ] Dockerfile and docker-compose.yml with documentation
- [ ] Live deployed application (Vercel)
- [ ] Comprehensive README with screenshots, setup instructions, architecture overview
- [ ] CLAUDE.md documenting project for AI assistants
- [ ] Video demo (5-10 minutes) walking through the app and code structure

---

*Last updated: 2026-03-24 — Built with Claude Code (claude-sonnet-4-6)*
