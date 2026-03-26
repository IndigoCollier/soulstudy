'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/dashboard', label: 'Home',      icon: '⌂' },
  { href: '/chat',      label: 'Ask Askia', icon: '✦' },
  { href: '/flashcards', label: 'Cards',    icon: '◈' },
  { href: '/quiz',      label: 'Quiz',      icon: '◎' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-[var(--color-surface-2)] bg-[var(--color-surface)]">
      {navLinks.map(({ href, label, icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium',
              'transition-colors duration-[var(--transition)] min-h-[56px] justify-center',
              active
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-subtle)] hover:text-[var(--color-muted)]',
            ].join(' ')}
          >
            <span className="text-lg leading-none">{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
