'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getConversation } from '@/lib/repositories/conversation.repository'
import type { ChatMessage } from '@/lib/models/chat'

const STORAGE_KEY = 'soulstudy_conversation_id'

export function useChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Load existing conversation on mount
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY)
    if (!savedId) return

    getConversation(savedId)
      .then(conv => {
        if (conv && conv.messages.length > 0) {
          setMessages(conv.messages)
          setConversationId(savedId)
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY)
      })
  }, [])

  async function sendMessage(text: string) {
    if (isStreaming || !text.trim()) return

    const userMessage: ChatMessage = {
      id:        crypto.randomUUID(),
      role:      'user',
      content:   text.trim(),
      createdAt: new Date().toISOString(),
    }

    const history = messages.map(m => ({ role: m.role, content: m.content }))

    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)

    const assistantId = crypto.randomUUID()
    const assistantPlaceholder: ChatMessage = {
      id:        assistantId,
      role:      'assistant',
      content:   '',
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, assistantPlaceholder])

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { 'x-user-id': user.uid } : {}),
        },
        body: JSON.stringify({
          message:        text.trim(),
          conversationId: conversationId ?? undefined,
          history,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Request failed')

      const newConvId = res.headers.get('X-Conversation-Id')
      if (newConvId && newConvId !== conversationId) {
        setConversationId(newConvId)
        localStorage.setItem(STORAGE_KEY, newConvId)
      }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullContent += decoder.decode(value, { stream: true })
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
        )
      }
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: 'Something went wrong. Please try again.' }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  function clearConversation() {
    setMessages([])
    setConversationId(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return { messages, isStreaming, sendMessage, clearConversation }
}
