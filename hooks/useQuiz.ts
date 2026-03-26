'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { saveQuizResult } from '@/lib/repositories/quiz.repository'
import type { Question } from '@/lib/models/quiz'

type QuizState = 'idle' | 'loading' | 'active' | 'results'

export function useQuiz() {
  const { user } = useAuth()
  const [state, setState]           = useState<QuizState>('idle')
  const [topic, setTopic]           = useState('')
  const [questions, setQuestions]   = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers]       = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [error, setError]           = useState<string | null>(null)

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
