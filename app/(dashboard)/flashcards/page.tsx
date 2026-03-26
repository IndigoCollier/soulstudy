'use client'

import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import FlashcardDeck from '@/components/flashcards/FlashcardDeck'
import { useFlashcards } from '@/hooks/useFlashcards'
import type { Deck } from '@/lib/models/flashcard'

export default function FlashcardsPage() {
  const { decks, isGenerating, isLoading, error, generateDeck } = useFlashcards()
  const [topic, setTopic]           = useState('')
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null)

  async function handleGenerate() {
    const deck = await generateDeck(topic)
    if (deck) {
      setTopic('')
      setActiveDeck(deck)
    }
  }

  // Studying a deck — full-screen mode
  if (activeDeck) {
    return (
      <PageWrapper>
        <div className="max-w-xl mx-auto">
          <FlashcardDeck deck={activeDeck} onDone={() => setActiveDeck(null)} />
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Flashcards">
      {/* Generate */}
      <div className="bg-[var(--color-surface)] rounded-2xl p-6 mb-8 border border-[var(--color-surface-2)]">
        <h3 className="font-serif text-lg font-semibold text-[var(--color-text)] mb-1">
          Generate a deck
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Enter any SPD topic and Askia will create 10 flashcards for you.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. Biological indicators, Steam sterilization…"
            disabled={isGenerating}
            className={[
              'flex-1 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-subtle)]',
              'px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-subtle)]',
              'outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed transition-all',
            ].join(' ')}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className={[
              'rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white',
              'hover:bg-[var(--color-primary-hover)] transition-all',
              'disabled:opacity-40 disabled:cursor-not-allowed',
            ].join(' ')}
          >
            {isGenerating ? 'Generating…' : 'Generate ✦'}
          </button>
        </div>
        {error && <p className="text-xs text-[var(--color-error)] mt-2">{error}</p>}
      </div>

      {/* Saved decks */}
      <h3 className="font-serif text-lg font-semibold text-[var(--color-text)] mb-4">
        Your decks
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-muted)] text-sm">
          No decks yet — generate your first one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {decks.map(deck => (
            <button
              key={deck.id}
              onClick={() => setActiveDeck(deck)}
              className={[
                'text-left rounded-2xl bg-[var(--color-surface)] border border-[var(--color-surface-2)]',
                'p-5 hover:border-[var(--color-primary)] transition-all duration-[var(--transition)]',
              ].join(' ')}
            >
              <p className="font-medium text-[var(--color-text)] mb-1">{deck.topic}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {deck.cards.length} cards · {new Date(deck.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
