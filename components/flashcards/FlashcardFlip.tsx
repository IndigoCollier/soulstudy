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
      className="relative w-full cursor-pointer"
      style={{ perspective: '1000px', height: '260px' }}
      onClick={() => setFlipped(f => !f)}
      role="button"
      aria-label={flipped ? 'Show question' : 'Show answer'}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle:  'preserve-3d',
          transform:       flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-surface-2)] p-8 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-xs text-[var(--color-accent)] font-medium mb-4 uppercase tracking-widest">
            Question
          </p>
          <p className="text-[var(--color-text)] text-lg font-medium leading-snug">
            {card.front}
          </p>
          <p className="text-xs text-[var(--color-subtle)] mt-6">Tap to reveal answer</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[var(--color-plum-deep)] border border-[var(--color-plum)] p-8 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-xs text-[var(--color-accent)] font-medium mb-4 uppercase tracking-widest">
            Answer
          </p>
          <p className="text-[var(--color-text)] text-base leading-relaxed">
            {card.back}
          </p>
          <p className="text-xs text-[var(--color-subtle)] mt-6">Tap to see question</p>
        </div>
      </div>
    </div>
  )
}
