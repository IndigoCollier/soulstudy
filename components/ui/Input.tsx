import { InputHTMLAttributes, forwardRef, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-muted)]"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full rounded-xl bg-[var(--color-surface-2)] border px-4 py-2.5 text-sm',
            'text-[var(--color-text)] placeholder:text-[var(--color-subtle)]',
            'outline-none transition-all duration-[var(--transition)]',
            'focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-[var(--color-error)]'
              : 'border-[var(--color-subtle)] hover:border-[var(--color-muted)]',
            className,
          ].join(' ')}
          {...props}
        />

        {error && (
          <p className="text-xs text-[var(--color-error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--color-subtle)]">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
