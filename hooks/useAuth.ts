'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/integrations/firebase'

interface AuthState {
  user: FirebaseUser | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: auth !== null,
  })

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false })
    })
    return unsubscribe
  }, [])

  return state
}
