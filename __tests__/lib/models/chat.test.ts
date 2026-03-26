import { describe, it, expect } from 'vitest'
import { ChatMessageSchema, ConversationSchema, ChatRequestSchema } from '@/lib/models/chat'

describe('ChatMessageSchema', () => {
  it('accepts a valid user message', () => {
    const result = ChatMessageSchema.safeParse({
      id:        'msg-1',
      role:      'user',
      content:   'What is sterilization?',
      createdAt: new Date().toISOString(),
    })
    expect(result.success).toBe(true)
  })

  it('accepts a valid assistant message', () => {
    const result = ChatMessageSchema.safeParse({
      id:        'msg-2',
      role:      'assistant',
      content:   'Sterilization destroys all microbial life including spores.',
      createdAt: new Date().toISOString(),
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid role', () => {
    const result = ChatMessageSchema.safeParse({
      id:        'msg-3',
      role:      'system',
      content:   'Some content',
      createdAt: new Date().toISOString(),
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing content', () => {
    const result = ChatMessageSchema.safeParse({
      id:        'msg-4',
      role:      'user',
      createdAt: new Date().toISOString(),
    })
    expect(result.success).toBe(false)
  })
})

describe('ConversationSchema', () => {
  const now = new Date().toISOString()

  it('accepts a valid conversation with messages', () => {
    const result = ConversationSchema.safeParse({
      id:        'conv-1',
      userId:    'user-abc',
      messages:  [
        { id: 'msg-1', role: 'user', content: 'Hello', createdAt: now },
        { id: 'msg-2', role: 'assistant', content: 'Hi!', createdAt: now },
      ],
      createdAt: now,
      updatedAt: now,
    })
    expect(result.success).toBe(true)
  })

  it('accepts an empty messages array', () => {
    const result = ConversationSchema.safeParse({
      id:        'conv-2',
      userId:    'user-abc',
      messages:  [],
      createdAt: now,
      updatedAt: now,
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing userId', () => {
    const result = ConversationSchema.safeParse({
      id:        'conv-3',
      messages:  [],
      createdAt: now,
      updatedAt: now,
    })
    expect(result.success).toBe(false)
  })
})

describe('ChatRequestSchema', () => {
  it('accepts a valid request', () => {
    const result = ChatRequestSchema.safeParse({
      message: 'What is a biological indicator?',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty message', () => {
    const result = ChatRequestSchema.safeParse({ message: '' })
    expect(result.success).toBe(false)
  })

  it('defaults history to empty array when omitted', () => {
    const result = ChatRequestSchema.safeParse({ message: 'Hello' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.history).toEqual([])
    }
  })

  it('accepts request with history', () => {
    const result = ChatRequestSchema.safeParse({
      message:        'Tell me more',
      conversationId: 'conv-123',
      history:        [
        { role: 'user',      content: 'What is sterilization?' },
        { role: 'assistant', content: 'Sterilization destroys all microbial life.' },
      ],
    })
    expect(result.success).toBe(true)
  })
})
