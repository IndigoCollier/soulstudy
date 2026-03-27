'use client'

import { useState } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  // Read the class the inline script already applied to <html>
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'dark'
    return document.documentElement.classList.contains('light') ? 'light' : 'dark'
  })

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(next)
    localStorage.setItem('soulstudy_theme', next)
    setTheme(next)
  }

  return { theme, toggle }
}
