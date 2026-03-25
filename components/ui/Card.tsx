import { HTMLAttributes } from 'react'

type GlowColor = 'primary' | 'accent' | 'plum'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: GlowColor
  padded?: boolean
}

const glowStyles: Record<GlowColor, string> = {
  primary: 'shadow-[0_0_24px_-4px_rgba(200,103,78,0.35)]',
  accent:  'shadow-[0_0_24px_-4px_rgba(212,168,83,0.35)]',
  plum:    'shadow-[0_0_24px_-4px_rgba(139,110,164,0.35)]',
}

export default function Card({ glow, padded = true, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl bg-[var(--color-surface)] border border-[var(--color-surface-2)]',
        'transition-all duration-[var(--transition)]',
        padded ? 'p-6' : '',
        glow ? glowStyles[glow] : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
