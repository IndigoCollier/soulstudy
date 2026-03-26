import { anthropic } from '@/lib/integrations/anthropic'
import type { Flashcard } from '@/lib/models/flashcard'

const SYSTEM_PROMPT = `You are an expert Sterile Processing Technician (SPD) educator.
Generate flashcards to help students prepare for CRCST and CBSPD certification exams.
Respond ONLY with valid JSON — no markdown, no explanation, no code fences.`

export async function generateFlashcards(topic: string): Promise<Flashcard[]> {
  if (!anthropic) throw new Error('Anthropic client is not initialized')

  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 2048,
    system:     SYSTEM_PROMPT,
    messages: [{
      role:    'user',
      content: `Generate 10 flashcards about: "${topic}"

Return a JSON object in exactly this format:
{
  "cards": [
    {
      "id": "1",
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

Make the questions exam-style — the kind that appear on the CRCST/CBSPD exams.
Keep answers concise but complete. Focus on accuracy — this is patient safety.`,
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.cards)) throw new Error('Invalid response shape')

    return parsed.cards.map((card: { id?: string; front: string; back: string }, i: number) => ({
      id:    card.id ?? String(i + 1),
      front: card.front,
      back:  card.back,
    }))
  } catch {
    throw new Error('Failed to parse flashcard response from AI')
  }
}
