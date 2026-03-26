import { describe, it, expect } from 'vitest'
import { FlashcardSchema, DeckSchema, GenerateDeckRequestSchema } from '@/lib/models/flashcard'

const now = new Date().toISOString()

describe('FlashcardSchema', () => {
  it('accepts a valid flashcard', () => {
    const result = FlashcardSchema.safeParse({
      id:    '1',
      front: 'What is a biological indicator?',
      back:  'A device used to monitor sterilization efficacy using resistant microorganisms.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing front', () => {
    const result = FlashcardSchema.safeParse({ id: '1', back: 'Answer' })
    expect(result.success).toBe(false)
  })

  it('rejects empty front', () => {
    const result = FlashcardSchema.safeParse({ id: '1', front: '', back: 'Answer' })
    expect(result.success).toBe(false)
  })
})

describe('DeckSchema', () => {
  const validDeck = {
    id:        'deck-1',
    userId:    'user-abc',
    topic:     'Steam sterilization',
    cards:     [{ id: '1', front: 'Q', back: 'A' }],
    createdAt: now,
  }

  it('accepts a valid deck', () => {
    expect(DeckSchema.safeParse(validDeck).success).toBe(true)
  })

  it('accepts a deck with no cards', () => {
    expect(DeckSchema.safeParse({ ...validDeck, cards: [] }).success).toBe(true)
  })

  it('rejects missing topic', () => {
    const { topic: _, ...rest } = validDeck
    expect(DeckSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects empty topic', () => {
    expect(DeckSchema.safeParse({ ...validDeck, topic: '' }).success).toBe(false)
  })
})

describe('GenerateDeckRequestSchema', () => {
  it('accepts a valid topic', () => {
    expect(GenerateDeckRequestSchema.safeParse({ topic: 'Biological indicators' }).success).toBe(true)
  })

  it('rejects a topic that is too short', () => {
    expect(GenerateDeckRequestSchema.safeParse({ topic: 'A' }).success).toBe(false)
  })

  it('rejects missing topic', () => {
    expect(GenerateDeckRequestSchema.safeParse({}).success).toBe(false)
  })
})
