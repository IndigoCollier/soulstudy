import type { ChatMessage } from '@/lib/models/chat'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-[var(--color-primary)] px-4 py-3 text-sm text-white">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[var(--color-accent)] font-medium px-1">
        Askia ✦
      </span>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>
    </div>
  )
}
