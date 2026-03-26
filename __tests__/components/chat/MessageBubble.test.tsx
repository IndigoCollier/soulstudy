import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MessageBubble from '@/components/chat/MessageBubble'
import type { ChatMessage } from '@/lib/models/chat'

const userMessage: ChatMessage = {
  id:        'msg-1',
  role:      'user',
  content:   'What is sterilization?',
  createdAt: new Date().toISOString(),
}

const assistantMessage: ChatMessage = {
  id:        'msg-2',
  role:      'assistant',
  content:   'Sterilization destroys all microbial life including spores.',
  createdAt: new Date().toISOString(),
}

describe('MessageBubble', () => {
  it('renders user message content', () => {
    render(<MessageBubble message={userMessage} />)
    expect(screen.getByText('What is sterilization?')).toBeTruthy()
  })

  it('renders assistant message content', () => {
    render(<MessageBubble message={assistantMessage} />)
    expect(screen.getByText('Sterilization destroys all microbial life including spores.')).toBeTruthy()
  })

  it('shows Askia label on assistant messages', () => {
    render(<MessageBubble message={assistantMessage} />)
    expect(screen.getByText(/Askia/)).toBeTruthy()
  })

  it('does not show Askia label on user messages', () => {
    render(<MessageBubble message={userMessage} />)
    expect(screen.queryByText(/Askia/)).toBeNull()
  })
})
