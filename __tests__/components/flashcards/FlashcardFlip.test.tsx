import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FlashcardFlip from '@/components/flashcards/FlashcardFlip'
import type { Flashcard } from '@/lib/models/flashcard'

const card: Flashcard = {
  id:    '1',
  front: 'What is a biological indicator?',
  back:  'A device used to monitor sterilization efficacy.',
}

describe('FlashcardFlip', () => {
  it('shows the front text on initial render', () => {
    render(<FlashcardFlip card={card} />)
    expect(screen.getByText('What is a biological indicator?')).toBeTruthy()
  })

  it('shows the back text after clicking', () => {
    render(<FlashcardFlip card={card} />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('A device used to monitor sterilization efficacy.')).toBeTruthy()
  })

  it('shows Question label on front', () => {
    render(<FlashcardFlip card={card} />)
    expect(screen.getByText('Question')).toBeTruthy()
  })

  it('shows Answer label on back', () => {
    render(<FlashcardFlip card={card} />)
    expect(screen.getByText('Answer')).toBeTruthy()
  })
})
