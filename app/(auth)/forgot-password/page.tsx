'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/integrations/firebase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email.')
      return
    }

    if (!auth) return
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch {
      setError('Could not send reset email. Check the address and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-[var(--color-text)]">
            Soul<span className="text-[var(--color-primary)]">Study</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Reset your password</p>
        </div>

        <Card glow="plum">
          {sent ? (
            <div className="text-center py-4 flex flex-col gap-3">
              <p className="text-2xl">✦</p>
              <p className="text-sm text-[var(--color-text)] font-medium">Check your inbox</p>
              <p className="text-xs text-[var(--color-muted)]">
                We sent a password reset link to <span className="text-[var(--color-accent)]">{email}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error || undefined}
                required
              />
              <Button type="submit" loading={loading} className="w-full mt-2">
                Send reset link
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          <Link href="/login" className="text-[var(--color-accent)] hover:underline">
            Back to sign in
          </Link>
        </p>

      </div>
    </main>
  )
}
