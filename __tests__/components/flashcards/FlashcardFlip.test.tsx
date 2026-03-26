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
    const matches = screen.getAllByText('What is a biological indicator?')
    expect(matches.length).toBeGreaterThan(0)
  })

  it('shows the back text after clicking', () => {
    render(<FlashcardFlip card={card} />)
    fireEvent.click(screen.getByRole('button'))
    const matches = screen.getAllByText('A device used to monitor sterilization efficacy.')
    expect(matches.length).toBeGreaterThan(0)
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
