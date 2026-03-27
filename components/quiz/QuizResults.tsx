interface QuizResultsProps {
  topic:    string
  score:    number
  total:    number
  onRetry:  () => void
  onNew:    () => void
}

export default function QuizResults({ topic, score, total, onRetry, onNew }: QuizResultsProps) {
  const pct        = Math.round((score / total) * 100)
  const passed     = pct >= 70

  function getMessage() {
    if (pct === 100) return "Perfect score. Askia is proud of you. ✦"
    if (pct >= 90)  return "Outstanding — you really know this material."
    if (pct >= 70)  return "Solid work. Keep reinforcing those weak spots."
    if (pct >= 50)  return "You're getting there. Let's run it back."
    return "This topic needs more attention. Don't give up — review and retry."
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8 text-center">
      {/* Score ring */}
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--color-surface-2)"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={passed ? 'var(--color-success)' : 'var(--color-primary)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl font-bold text-[var(--color-text)]">{pct}%</span>
          <span className="text-xs text-[var(--color-muted)]">{score}/{total}</span>
        </div>
      </div>

      {/* Message */}
      <div>
        <p className="font-serif text-xl font-semibold text-[var(--color-text)] mb-2">
          {passed ? 'Nice work' : 'Keep studying'}
        </p>
        <p className="text-sm text-[var(--color-muted)] max-w-xs">{getMessage()}</p>
        <p className="text-xs text-[var(--color-subtle)] mt-2">Topic: {topic}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="flex-1 rounded-xl border border-[var(--color-surface-2)] py-2.5 text-sm text-[var(--color-muted)] hover:border-[var(--color-muted)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          Retry same topic
        </button>
        <button
          onClick={onNew}
          className="flex-1 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm text-white font-medium hover:bg-[var(--color-primary-hover)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          New quiz ✦
        </button>
      </div>
    </div>
  )
}
