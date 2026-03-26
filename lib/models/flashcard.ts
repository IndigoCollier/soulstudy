import { z } from 'zod'

export const FlashcardSchema = z.object({
  id:    z.string(),
  front: z.string().min(1),
  back:  z.string().min(1),
})

export type Flashcard = z.infer<typeof FlashcardSchema>

export const DeckSchema = z.object({
  id:        z.string(),
  userId:    z.string(),
  topic:     z.string().min(1),
  cards:     z.array(FlashcardSchema),
  createdAt: z.string().datetime(),
})

export type Deck = z.infer<typeof DeckSchema>

export const GenerateDeckRequestSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters'),
})

export type GenerateDeckRequest = z.infer<typeof GenerateDeckRequestSchema>
