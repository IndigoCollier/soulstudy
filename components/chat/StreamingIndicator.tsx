export default function StreamingIndicator() {
  return (
    <div
      role="status"
      aria-label="Askia is responding"
      className="flex items-center gap-1 px-4 py-3"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
