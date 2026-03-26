'use client'

import { useChat } from '@/hooks/useChat'
import ChatWindow from '@/components/chat/ChatWindow'
import ChatInput from '@/components/chat/ChatInput'

export default function ChatPage() {
  const { messages, isStreaming, sendMessage, clearConversation } = useChat()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-2)]">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[var(--color-text)]">
            Ask Askia
          </h2>
          <p className="text-xs text-[var(--color-muted)]">SPD Certification Study Assistant</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearConversation}
            className="text-xs text-[var(--color-subtle)] hover:text-[var(--color-muted)] transition-colors"
          >
            New conversation
          </button>
        )}
      </div>

      {/* Messages */}
      <ChatWindow messages={messages} isStreaming={isStreaming} />

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  )
}
