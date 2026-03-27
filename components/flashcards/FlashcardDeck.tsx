'use client'

import { useState } from 'react'
import type { Deck } from '@/lib/models/flashcard'
import FlashcardFlip from './FlashcardFlip'

interface FlashcardDeckProps {
  deck: Deck
  onDone: () => void
}

export default function FlashcardDeck({ deck, onDone }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0)
  const card  = deck.cards[index]
  const total = deck.cards.length

  return (
    <div className="flex flex-col gap-6">
      {/* Topic + progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[var(--color-text)]">
            {deck.topic}
          </h3>
          <p className="text-xs text-[var(--color-muted)]">
            Card {index + 1} of {total}
          </p>
        </div>
        <button
          onClick={onDone}
          className="text-xs text-[var(--color-subtle)] hover:text-[var(--color-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg px-1"
        >
          ✕ Close
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-1 rounded-full bg-[var(--color-primary)] transition-all duration-300"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <FlashcardFlip key={index} card={card} />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setIndex(i => i - 1)}
          disabled={index === 0}
          className="flex-1 rounded-xl border border-[var(--color-surface-2)] py-2.5 text-sm text-[var(--color-muted)] transition-all hover:border-[var(--color-muted)] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          ← Previous
        </button>

        {index < total - 1 ? (
          <button
            onClick={() => setIndex(i => i + 1)}
            className="flex-1 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm text-white transition-all hover:bg-[var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onDone}
            className="flex-1 rounded-xl bg-[var(--color-accent)] py-2.5 text-sm text-[var(--color-bg)] font-medium transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            Done ✦
          </button>
        )}
      </div>
    </div>
  )
}
