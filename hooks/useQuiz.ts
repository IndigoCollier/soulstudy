'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { saveQuizResult } from '@/lib/repositories/quiz.repository'
import type { Question } from '@/lib/models/quiz'

type QuizState = 'idle' | 'loading' | 'active' | 'results'

const STORAGE_KEY = 'soulstudy_quiz_progress'

interface QuizProgress {
  topic:        string
  questions:    Question[]
  currentIndex: number
  answers:      number[]
}

function loadProgress(): QuizProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveProgress(progress: QuizProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch { /* storage full or unavailable */ }
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}

export function useQuiz() {
  const { user } = useAuth()

  const saved = typeof window !== 'undefined' ? loadProgress() : null

  const [state, setState]           = useState<QuizState>(saved ? 'active' : 'idle')
  const [topic, setTopic]           = useState(saved?.topic ?? '')
  const [questions, setQuestions]   = useState<Question[]>(saved?.questions ?? [])
  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex ?? 0)
  const [answers, setAnswers]       = useState<number[]>(saved?.answers ?? [])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [error, setError]           = useState<string | null>(null)

  // Keep localStorage in sync whenever active quiz state changes
  useEffect(() => {
    if (state === 'active' && questions.length > 0) {
      saveProgress({ topic, questions, currentIndex, answers })
    }
  }, [state, topic, questions, currentIndex, answers])

  const score = answers.filter((ans, i) => ans === questions[i]?.correctIndex).length

  async function startQuiz(topicInput: string) {
    if (!topicInput.trim() || state === 'loading') return
    setError(null)
    setState('loading')
    setTopic(topicInput.trim())

    try {
      const res = await fetch('/api/quiz', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ topic: topicInput.trim() }),
      })

      if (!res.ok) throw new Error('Failed to generate quiz')

      const data = await res.json()
      clearProgress()
      setQuestions(data.questions)
      setAnswers([])
      setCurrentIndex(0)
      setSelectedIndex(null)
      setState('active')
    } catch {
      setError('Failed to generate quiz. Please try again.')
      setState('idle')
    }
  }

  function selectAnswer(index: number) {
    if (selectedIndex !== null) return
    setSelectedIndex(index)
  }

  function nextQuestion() {
    if (selectedIndex === null) return

    const newAnswers = [...answers, selectedIndex]
    setAnswers(newAnswers)
    setSelectedIndex(null)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      // Quiz finished — save result
      const finalScore = newAnswers.filter((ans, i) => ans === questions[i]?.correctIndex).length
      clearProgress()
      setState('results')

      if (user) {
        saveQuizResult(user.uid, topic, questions, newAnswers, finalScore).catch(() => {
          // Non-fatal — result just won't persist
        })
      }
    }
  }

  function retry() {
    startQuiz(topic)
  }

  function reset() {
    clearProgress()
    setState('idle')
    setTopic('')
    setQuestions([])
    setAnswers([])
    setCurrentIndex(0)
    setSelectedIndex(null)
    setError(null)
  }

  return {
    state,
    topic,
    questions,
    currentIndex,
    selectedIndex,
    score,
    error,
    startQuiz,
    selectAnswer,
    nextQuestion,
    retry,
    reset,
  }
}
