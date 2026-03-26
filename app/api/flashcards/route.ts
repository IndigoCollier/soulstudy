import { NextRequest, NextResponse } from 'next/server'
import { generateFlashcards } from '@/lib/services/flashcard.service'
import { createDeck } from '@/lib/repositories/deck.repository'
import { GenerateDeckRequestSchema } from '@/lib/models/flashcard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = GenerateDeckRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { topic } = parsed.data
    const userId    = req.headers.get('x-user-id')

    const cards = await generateFlashcards(topic)

    let deckId: string | null = null
    if (userId) {
      deckId = await createDeck(userId, topic, cards)
    }

    return NextResponse.json({ deckId, topic, cards })
  } catch (err) {
    console.error('[POST /api/flashcards]', err)
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 })
  }
}
