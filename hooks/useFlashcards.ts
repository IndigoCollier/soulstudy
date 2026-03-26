'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserDecks } from '@/lib/repositories/deck.repository'
import type { Deck } from '@/lib/models/flashcard'

export function useFlashcards() {
  const { user } = useAuth()
  const [decks, setDecks]           = useState<Deck[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const loadDecks = useCallback(async () => {
    if (!user) return
    try {
      const userDecks = await getUserDecks(user.uid)
      setDecks(userDecks)
    } catch {
      // Non-fatal — just show empty state
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadDecks()
  }, [loadDecks])

  async function generateDeck(topic: string): Promise<Deck | null> {
    if (!topic.trim() || isGenerating) return null
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/flashcards', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'x-user-id': user.uid } : {}),
        },
        body: JSON.stringify({ topic: topic.trim() }),
      })

      if (!res.ok) throw new Error('Generation failed')

      const data = await res.json()
      const newDeck: Deck = {
        id:        data.deckId ?? crypto.randomUUID(),
        userId:    user?.uid ?? '',
        topic:     data.topic,
        cards:     data.cards,
        createdAt: new Date().toISOString(),
      }

      setDecks(prev => [newDeck, ...prev])
      return newDeck
    } catch {
      setError('Failed to generate flashcards. Please try again.')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return { decks, isGenerating, isLoading, error, generateDeck, loadDecks }
}
