'use client'

import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import QuizQuestion from '@/components/quiz/QuizQuestion'
import QuizResults from '@/components/quiz/QuizResults'
import { useQuiz } from '@/hooks/useQuiz'

export default function QuizPage() {
  const {
    state, topic, questions, currentIndex,
    selectedIndex, score, error,
    startQuiz, selectAnswer, nextQuestion, retry, reset,
  } = useQuiz()

  const [input, setInput] = useState('')

  function handleStart() {
    if (!input.trim()) return
    startQuiz(input)
    setInput('')
  }

  // Results screen
  if (state === 'results') {
    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto w-full">
          <QuizResults
            topic={topic}
            score={score}
            total={questions.length}
            onRetry={retry}
            onNew={reset}
          />
        </div>
      </PageWrapper>
    )
  }

  // Active quiz
  if (state === 'active') {
    const question = questions[currentIndex]
    const isLast   = currentIndex === questions.length - 1

    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto w-full flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[var(--color-text)]">
              {topic}
            </h2>
            <button
              onClick={reset}
              className="text-xs text-[var(--color-subtle)] hover:text-[var(--color-muted)] transition-colors"
            >
              ✕ Quit
            </button>
          </div>

          <QuizQuestion
            question={question}
            questionIndex={currentIndex}
            total={questions.length}
            selectedIndex={selectedIndex}
            onSelect={selectAnswer}
          />

          {selectedIndex !== null && (
            <button
              onClick={nextQuestion}
              className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] transition-all"
            >
              {isLast ? 'See results ✦' : 'Next question →'}
            </button>
          )}
        </div>
      </PageWrapper>
    )
  }

  // Idle / loading
  return (
    <PageWrapper title="Quiz">
      <div className="max-w-lg mx-auto w-full">
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 border border-[var(--color-surface-2)]">
          <h3 className="font-serif text-lg font-semibold text-[var(--color-text)] mb-1">
            Start a quiz
          </h3>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            Enter any SPD topic and Askia will generate 10 multiple-choice questions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
              placeholder="e.g. Sterilization methods, Infection control…"
              disabled={state === 'loading'}
              className={[
                'flex-1 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-subtle)]',
                'px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-subtle)]',
                'outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed transition-all',
              ].join(' ')}
            />
            <button
              onClick={handleStart}
              disabled={state === 'loading' || !input.trim()}
              className={[
                'shrink-0 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white',
                'hover:bg-[var(--color-primary-hover)] transition-all',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {state === 'loading' ? 'Generating…' : 'Start ✦'}
            </button>
          </div>

          {error && <p className="text-xs text-[var(--color-error)] mt-2">{error}</p>}
        </div>
      </div>
    </PageWrapper>
  )
}
