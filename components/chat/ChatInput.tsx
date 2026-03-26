'use client'

import { useRef, useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex items-end gap-3 border-t border-[var(--color-surface-2)] bg-[var(--color-surface)] px-4 py-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder="Ask Askia anything about SPD certification…"
        rows={1}
        className={[
          'flex-1 resize-none rounded-xl bg-[var(--color-surface-2)] px-4 py-2.5',
          'text-sm text-[var(--color-text)] placeholder:text-[var(--color-subtle)]',
          'outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
          'transition-all duration-[var(--transition)] min-h-[44px]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ].join(' ')}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
          'bg-[var(--color-primary)] text-white transition-all duration-[var(--transition)]',
          'hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        ➤
      </button>
    </div>
  )
}
