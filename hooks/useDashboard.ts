'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserQuizResults } from '@/lib/repositories/quiz.repository'
import { getUserDecks } from '@/lib/repositories/deck.repository'
import type { QuizResult } from '@/lib/models/quiz'
import type { Deck } from '@/lib/models/flashcard'

interface DashboardData {
  loading:      boolean
  quizResults:  QuizResult[]
  decks:        Deck[]
  totalQuizzes: number
  bestScore:    number | null   // percentage 0-100, null if no quizzes
  totalDecks:   number
}

export function useDashboard(): DashboardData {
  const { user, loading: authLoading } = useAuth()
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [decks, setDecks]             = useState<Deck[]>([])
  const [fetched, setFetched]         = useState(false)

  useEffect(() => {
    if (authLoading || !user) return

    Promise.all([
      getUserQuizResults(user.uid),
      getUserDecks(user.uid),
    ])
      .then(([results, userDecks]) => {
        setQuizResults(results)
        setDecks(userDecks)
      })
      .catch(() => { /* non-fatal — stats show zeros */ })
      .finally(() => setFetched(true))
  }, [user, authLoading])

  // loading while auth resolves, or while we have a user but haven't fetched yet
  const loading = authLoading || (!!user && !fetched)

  const bestScore = quizResults.length > 0
    ? Math.max(...quizResults.map(r => Math.round((r.score / r.total) * 100)))
    : null

  return {
    loading,
    quizResults,
    decks,
    totalQuizzes: quizResults.length,
    bestScore,
    totalDecks:   decks.length,
  }
}
