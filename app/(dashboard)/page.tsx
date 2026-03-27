'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/hooks/useAuth'
import type { QuizResult } from '@/lib/models/quiz'

// ─── Quotes ──────────────────────────────────────────────────────────────────

const QUOTES = [
  { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
  { text: 'The function of education is to teach one to think intensively and to think critically.', author: 'Martin Luther King Jr.' },
  { text: 'Knowledge is like a garden: if it is not cultivated, it cannot be harvested.', author: 'African Proverb' },
  { text: 'Until the lion learns to write, every story will glorify the hunter.', author: 'African Proverb' },
  { text: 'However long the night, the dawn will break.', author: 'African Proverb' },
  { text: 'Rain does not fall on one roof alone.', author: 'African Proverb' },
  { text: 'Wisdom is like a baobab tree; no one individual can embrace it.', author: 'Akan Proverb' },
  { text: 'If you want to go fast, go alone. If you want to go far, go together.', author: 'African Proverb' },
  { text: 'A child who is not embraced by the village will burn it down to feel its warmth.', author: 'African Proverb' },
  { text: 'The one who tells the stories rules the world.', author: 'Hopi Proverb' },
]

function getDailyQuote() {
  return QUOTES[new Date().getDate() % QUOTES.length]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(displayName: string | null | undefined, email: string | null | undefined) {
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const name = displayName?.split(' ')[0] ?? email?.split('@')[0] ?? 'Scholar'
  return `Good ${timeOfDay}, ${name} ✦`
}

// ─── Quiz History Row ─────────────────────────────────────────────────────────

function QuizHistoryRow({ result }: { result: QuizResult }) {
  const [expanded, setExpanded] = useState(false)
  const pct     = Math.round((result.score / result.total) * 100)
  const passed  = pct >= 70
  const date    = new Date(result.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="border border-[var(--color-surface-2)] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-2)] transition-colors text-left"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-[var(--color-text)] truncate">{result.topic}</span>
          <span className="text-xs text-[var(--color-muted)]">{date}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className={`text-sm font-semibold ${passed ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
            {pct}%
          </span>
          <span className="text-xs text-[var(--color-subtle)]">{result.score}/{result.total}</span>
          <span className="text-[var(--color-subtle)] text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[var(--color-surface-2)] flex flex-col gap-2">
          {result.questions.map((q, i) => {
            const userAnswer = result.answers[i]
            const correct    = userAnswer === q.correctIndex
            return (
              <div key={q.id} className="flex gap-3 items-start">
                <span className={`mt-0.5 shrink-0 text-xs font-bold ${correct ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                  {correct ? '✓' : '✗'}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-[var(--color-text)]">{q.question}</span>
                  {!correct && (
                    <span className="text-xs text-[var(--color-muted)]">
                      Correct: {q.options[q.correctIndex]}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user }                                          = useAuth()
  const { loading, quizResults, totalQuizzes, bestScore, totalDecks } = useDashboard()
  const quote = getDailyQuote()

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">

        {/* Greeting + Quote */}
        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)]">
            {getGreeting(user?.displayName, user?.email)}
          </h2>
          <blockquote className="border-l-2 border-[var(--color-accent)] pl-4">
            <p className="text-sm text-[var(--color-muted)] italic">&ldquo;{quote.text}&rdquo;</p>
            <footer className="text-xs text-[var(--color-subtle)] mt-1">— {quote.author}</footer>
          </blockquote>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--color-surface)] border border-[var(--color-surface-2)] rounded-2xl p-4 flex flex-col gap-1">
            <span className="text-2xl font-serif font-semibold text-[var(--color-primary)]">
              {loading ? '—' : totalQuizzes}
            </span>
            <span className="text-xs text-[var(--color-muted)]">Quizzes taken</span>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-surface-2)] rounded-2xl p-4 flex flex-col gap-1">
            <span className="text-2xl font-serif font-semibold text-[var(--color-accent)]">
              {loading ? '—' : bestScore !== null ? `${bestScore}%` : '—'}
            </span>
            <span className="text-xs text-[var(--color-muted)]">Best score</span>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-surface-2)] rounded-2xl p-4 flex flex-col gap-1">
            <span className="text-2xl font-serif font-semibold text-[var(--color-plum)]">
              {loading ? '—' : totalDecks}
            </span>
            <span className="text-xs text-[var(--color-muted)]">Decks created</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">
            Study now
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/chat"
              className="bg-[var(--color-surface)] border border-[var(--color-surface-2)] rounded-2xl p-5 flex flex-col gap-2 hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-2)] transition-all group"
            >
              <span className="text-2xl">💬</span>
              <span className="font-serif font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                Ask Askia
              </span>
              <span className="text-xs text-[var(--color-muted)]">Chat with your AI study guide</span>
            </Link>
            <Link
              href="/flashcards"
              className="bg-[var(--color-surface)] border border-[var(--color-surface-2)] rounded-2xl p-5 flex flex-col gap-2 hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-all group"
            >
              <span className="text-2xl">🗂</span>
              <span className="font-serif font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                Flashcards
              </span>
              <span className="text-xs text-[var(--color-muted)]">Generate and review decks</span>
            </Link>
            <Link
              href="/quiz"
              className="bg-[var(--color-surface)] border border-[var(--color-surface-2)] rounded-2xl p-5 flex flex-col gap-2 hover:border-[var(--color-plum)] hover:bg-[var(--color-surface-2)] transition-all group"
            >
              <span className="text-2xl">✏️</span>
              <span className="font-serif font-semibold text-[var(--color-text)] group-hover:text-[var(--color-plum)] transition-colors">
                Quiz mode
              </span>
              <span className="text-xs text-[var(--color-muted)]">Test your knowledge</span>
            </Link>
          </div>
        </div>

        {/* Quiz History */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">
            Quiz history
          </h3>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 rounded-xl bg-[var(--color-surface)] animate-pulse" />
              ))}
            </div>
          ) : quizResults.length === 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-surface-2)] rounded-2xl px-5 py-8 text-center">
              <p className="text-sm text-[var(--color-muted)]">No quizzes yet.</p>
              <Link href="/quiz" className="text-xs text-[var(--color-primary)] hover:underline mt-1 inline-block">
                Start your first quiz →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {quizResults.map(result => (
                <QuizHistoryRow key={result.id} result={result} />
              ))}
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  )
}
