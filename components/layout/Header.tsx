'use client'

import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/integrations/firebase'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Header() {
  const { user } = useAuth()
  const router = useRouter()

  const firstName = user?.displayName?.split(' ')[0] ?? 'Scholar'

  async function handleSignOut() {
    if (!auth) return
    await signOut(auth)
    router.push('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[var(--color-surface)] border-b border-[var(--color-surface-2)]">
      <div>
        <p className="text-sm text-[var(--color-muted)]">{getGreeting()},</p>
        <p className="font-serif text-lg font-semibold text-[var(--color-text)]">{firstName} ✦</p>
      </div>

      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </header>
  )
}
