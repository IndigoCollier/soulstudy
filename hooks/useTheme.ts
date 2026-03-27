'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('soulstudy_theme') as Theme | null
    if (saved === 'light' || saved === 'dark') setTheme(saved)
  }, [])

  // Apply theme to <html> and persist whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('soulstudy_theme', theme)
  }, [theme])

  function toggle() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggle }
}
