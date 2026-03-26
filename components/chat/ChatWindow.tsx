'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/lib/models/chat'
import MessageBubble from './MessageBubble'
import StreamingIndicator from './StreamingIndicator'

interface ChatWindowProps {
  messages: ChatMessage[]
  isStreaming: boolean
}

export default function ChatWindow({ messages, isStreaming }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  const isEmpty = messages.length === 0

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {isEmpty && !isStreaming && (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center pt-16">
          <p className="text-4xl">✦</p>
          <p className="font-serif text-xl text-[var(--color-text)]">Ask Askia anything</p>
          <p className="text-sm text-[var(--color-muted)] max-w-sm">
            I&apos;m here to help you ace your SPD certification. Ask me about sterilization
            methods, instrument care, infection control — anything on the exam.
          </p>
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[var(--color-accent)] font-medium px-1">Askia ✦</span>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--color-surface-2)]">
            <StreamingIndicator />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
