import { HTMLAttributes } from 'react'

type BadgeVariant = 'primary' | 'accent' | 'plum' | 'success' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-[rgba(200,103,78,0.18)] text-[var(--color-primary)] border-[rgba(200,103,78,0.3)]',
  accent:  'bg-[rgba(212,168,83,0.18)] text-[var(--color-accent)] border-[rgba(212,168,83,0.3)]',
  plum:    'bg-[rgba(139,110,164,0.18)] text-[var(--color-plum)] border-[rgba(139,110,164,0.3)]',
  success: 'bg-[rgba(122,158,126,0.18)] text-[var(--color-success)] border-[rgba(122,158,126,0.3)]',
  muted:   'bg-[var(--color-surface-2)] text-[var(--color-muted)] border-[var(--color-subtle)]',
}

export default function Badge({ variant = 'muted', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
