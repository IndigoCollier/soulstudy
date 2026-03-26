'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Modal({ open, onClose, title, children, className = '' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={[
          'relative z-10 w-full max-w-md rounded-2xl bg-[var(--color-surface)]',
          'border border-[var(--color-surface-2)] p-6 shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          className,
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {title && (
            <h2
              id="modal-title"
              className="font-serif text-lg font-semibold text-[var(--color-text)]"
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto flex-shrink-0 rounded-full p-1 text-[var(--color-subtle)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)] transition-all duration-[var(--transition)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
