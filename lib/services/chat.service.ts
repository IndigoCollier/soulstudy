import fs from 'fs'
import path from 'path'
import { anthropic } from '@/lib/integrations/anthropic'

export interface MessageParam {
  role: 'user' | 'assistant'
  content: string
}

function loadSystemPrompt(): string {
  const promptPath = path.join(process.cwd(), 'lib', 'prompts', 'study-assistant.md')
  return fs.readFileSync(promptPath, 'utf-8')
}

export async function streamChatResponse(
  userMessage: string,
  history: MessageParam[],
): Promise<ReadableStream<Uint8Array>> {
  if (!anthropic) {
    throw new Error('Anthropic client is not initialized — check ANTHROPIC_API_KEY')
  }

  const systemPrompt = loadSystemPrompt()

  const messages: MessageParam[] = [
    ...history,
    { role: 'user', content: userMessage },
  ]

  const stream = await anthropic.messages.stream({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     systemPrompt,
    messages,
  })

  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
    cancel() {
      stream.controller.abort()
    },
  })
}
