import { z } from 'zod'

export const ChatMessageSchema = z.object({
  id:        z.string(),
  role:      z.enum(['user', 'assistant']),
  content:   z.string(),
  createdAt: z.string().datetime(),
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>

export const ConversationSchema = z.object({
  id:        z.string(),
  userId:    z.string(),
  messages:  z.array(ChatMessageSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Conversation = z.infer<typeof ConversationSchema>

export const ChatRequestSchema = z.object({
  message:        z.string().min(1, 'Message cannot be empty'),
  conversationId: z.string().optional(),
  history:        z.array(z.object({
    role:    z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
})

export type ChatRequest = z.infer<typeof ChatRequestSchema>
