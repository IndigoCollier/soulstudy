import type { Question } from '@/lib/models/quiz'

interface QuizQuestionProps {
  question:      Question
  questionIndex: number
  total:         number
  selectedIndex: number | null
  onSelect:      (index: number) => void
}

const LABELS = ['A', 'B', 'C', 'D']

export default function QuizQuestion({
  question,
  questionIndex,
  total,
  selectedIndex,
  onSelect,
}: QuizQuestionProps) {
  const answered = selectedIndex !== null

  function optionStyle(i: number): string {
    const base = 'w-full text-left rounded-xl border px-4 py-3 text-sm transition-all duration-[var(--transition)] flex items-start gap-3'

    if (!answered) {
      return `${base} border-[var(--color-surface-2)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-2)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`
    }

    if (i === question.correctIndex) {
      return `${base} border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-text)] cursor-default`
    }

    if (i === selectedIndex) {
      return `${base} border-[var(--color-error)] bg-[var(--color-error)]/10 text-[var(--color-text)] cursor-default`
    }

    return `${base} border-[var(--color-surface-2)] text-[var(--color-subtle)] cursor-default opacity-60`
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>Question {questionIndex + 1} of {total}</span>
        <span>{Math.round(((questionIndex + 1) / total) * 100)}%</span>
      </div>

      <div className="h-1 w-full rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-1 rounded-full bg-[var(--color-primary)] transition-all duration-300"
          style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <p className="text-[var(--color-text)] font-medium text-base leading-snug">
        {question.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => !answered && onSelect(i)}
            disabled={answered}
            className={optionStyle(i)}
          >
            <span className={[
              'shrink-0 h-6 w-6 rounded-full border text-xs font-bold flex items-center justify-center',
              !answered
                ? 'border-[var(--color-subtle)] text-[var(--color-muted)]'
                : i === question.correctIndex
                  ? 'border-[var(--color-success)] text-[var(--color-success)] bg-[var(--color-success)]/20'
                  : i === selectedIndex
                    ? 'border-[var(--color-error)] text-[var(--color-error)] bg-[var(--color-error)]/20'
                    : 'border-[var(--color-surface-2)] text-[var(--color-subtle)]',
            ].join(' ')}>
              {LABELS[i]}
            </span>
            <span className="flex-1">{option}</span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-surface-2)] p-4 text-sm text-[var(--color-muted)] leading-relaxed">
          <span className="text-[var(--color-accent)] font-medium">Askia ✦ </span>
          {question.explanation}
        </div>
      )}
    </div>
  )
}
