'use client'

import { useState } from 'react'
import type { Flashcard } from '@/lib/models/flashcard'

interface FlashcardFlipProps {
  card: Flashcard
}

export default function FlashcardFlip({ card }: FlashcardFlipProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative w-full cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      style={{ perspective: '1000px', minHeight: '220px' }}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFlipped(f => !f)}
      role="button"
      tabIndex={0}
      aria-label={flipped ? 'Show question' : 'Show answer'}
    >
      {/* Invisible spacer so the container grows with content */}
      <div className="invisible px-5 py-6 md:px-8">
        <p className="text-lg leading-snug">{card.front}</p>
        <p className="text-base leading-relaxed mt-2">{card.back}</p>
        <p className="text-xs mt-6">placeholder</p>
      </div>

      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform:      flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-surface-2)] px-5 py-6 md:px-8 text-center overflow-y-auto"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-xs text-[var(--color-accent)] font-medium mb-4 uppercase tracking-widest">
            Question
          </p>
          <p className="text-[var(--color-text)] text-base md:text-lg font-medium leading-snug">
            {card.front}
          </p>
          <p className="text-xs text-[var(--color-subtle)] mt-6 shrink-0">Tap to reveal answer</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[var(--color-plum-deep)] border border-[var(--color-plum)] px-5 py-6 md:px-8 text-center overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-xs text-[var(--color-accent)] font-medium mb-4 uppercase tracking-widest">
            Answer
          </p>
          <p className="text-[var(--color-text)] text-sm md:text-base leading-relaxed">
            {card.back}
          </p>
          <p className="text-xs text-[var(--color-subtle)] mt-6 shrink-0">Tap to see question</p>
        </div>
      </div>
    </div>
  )
}
