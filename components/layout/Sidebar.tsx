'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/dashboard',   label: 'Dashboard',   icon: '⌂' },
  { href: '/chat',        label: 'Ask Askia',   icon: '✦' },
  { href: '/flashcards',  label: 'Flashcards',  icon: '◈' },
  { href: '/quiz',        label: 'Quiz',         icon: '◎' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[var(--color-surface)] border-r border-[var(--color-surface-2)] px-4 py-6">
      {/* Wordmark */}
      <div className="mb-8 px-2">
        <h1 className="font-serif text-2xl font-semibold text-[var(--color-text)]">
          Soul<span className="text-[var(--color-primary)]">Study</span>
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-0.5">SPD Certification Prep</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navLinks.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-[var(--transition)]',
                active
                  ? 'bg-[var(--color-primary)] text-[var(--color-text)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
              ].join(' ')}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sparkle divider */}
      <div className="divider-sparkle text-xs my-4">✦</div>

      <p className="text-xs text-[var(--color-subtle)] px-2 text-center">
        Powered by Askia AI
      </p>
    </aside>
  )
}
