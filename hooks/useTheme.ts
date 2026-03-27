'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

// Light mode overrides — injected as inline style properties on <html>
// so React's className management can't interfere
const LIGHT_VARS: Record<string, string> = {
  '--color-bg':            '#FAF6F0',
  '--color-surface':       '#F0EAE2',
  '--color-surface-2':     '#E4DAD0',
  '--color-plum-deep':     '#EDE5F5',
  '--color-text':          '#1A1210',
  '--color-muted':         '#5C4A3A',
  '--color-subtle':        '#8A7A70',
  '--color-primary':       '#C8674E',
  '--color-primary-hover': '#B55A42',
  '--color-accent':        '#C49843',
  '--color-plum':          '#7A5E93',
  '--color-success':       '#4A7A4E',
  '--color-error':         '#B85540',
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'light') {
    Object.entries(LIGHT_VARS).forEach(([k, v]) => root.style.setProperty(k, v))
  } else {
    Object.keys(LIGHT_VARS).forEach(k => root.style.removeProperty(k))
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('soulstudy_theme') === 'light' ? 'light' : 'dark'
  })

  // Apply CSS vars and persist whenever theme changes — DOM only, no setState
  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('soulstudy_theme', theme)
  }, [theme])

  function toggle() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggle }
}
