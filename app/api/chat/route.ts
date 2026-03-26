import { NextRequest, NextResponse } from 'next/server'
import { streamChatResponse } from '@/lib/services/chat.service'
import { appendMessage, createConversation } from '@/lib/repositories/conversation.repository'
import { ChatRequestSchema } from '@/lib/models/chat'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = ChatRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { message, conversationId, history } = parsed.data
    const userId = req.headers.get('x-user-id')

    // Resolve or create conversation
    let convId = conversationId
    if (!convId && userId) {
      convId = await createConversation(userId)
    }

    // Save user message to Firestore
    if (convId && userId) {
      await appendMessage(convId, {
        role:      'user',
        content:   message,
        createdAt: new Date().toISOString(),
      })
    }

    // Stream response from Anthropic
    const stream = await streamChatResponse(message, history ?? [])

    // Collect full response text while streaming it out
    let fullResponse = ''
    const [streamA, streamB] = stream.tee()

    // Background: collect text for Firestore save
    const reader = streamB.getReader()
    const decoder = new TextDecoder()
    ;(async () => {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullResponse += decoder.decode(value, { stream: true })
      }
      if (convId && userId) {
        await appendMessage(convId, {
          role:      'assistant',
          content:   fullResponse,
          createdAt: new Date().toISOString(),
        })
      }
    })()

    return new Response(streamA, {
      headers: {
        'Content-Type':        'text/plain; charset=utf-8',
        'Transfer-Encoding':   'chunked',
        'X-Conversation-Id':   convId ?? '',
      },
    })
  } catch (err) {
    console.error('[POST /api/chat]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
