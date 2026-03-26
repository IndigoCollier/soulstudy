import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QuizQuestion from '@/components/quiz/QuizQuestion'
import type { Question } from '@/lib/models/quiz'

const question: Question = {
  id:           '1',
  question:     'Which sterilization method uses moist heat under pressure?',
  options:      ['Dry heat', 'Steam autoclave', 'EtO gas', 'UV radiation'],
  correctIndex: 1,
  explanation:  'Steam sterilization uses pressurized steam at 121°C or 134°C.',
}

describe('QuizQuestion', () => {
  it('renders the question text', () => {
    render(
      <QuizQuestion
        question={question}
        questionIndex={0}
        total={10}
        selectedIndex={null}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('Which sterilization method uses moist heat under pressure?')).toBeTruthy()
  })

  it('renders all 4 answer options', () => {
    render(
      <QuizQuestion
        question={question}
        questionIndex={0}
        total={10}
        selectedIndex={null}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText('Dry heat')).toBeTruthy()
    expect(screen.getByText('Steam autoclave')).toBeTruthy()
    expect(screen.getByText('EtO gas')).toBeTruthy()
    expect(screen.getByText('UV radiation')).toBeTruthy()
  })

  it('calls onSelect when an option is clicked', () => {
    const onSelect = vi.fn()
    render(
      <QuizQuestion
        question={question}
        questionIndex={0}
        total={10}
        selectedIndex={null}
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByText('Steam autoclave'))
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('shows explanation after an answer is selected', () => {
    render(
      <QuizQuestion
        question={question}
        questionIndex={0}
        total={10}
        selectedIndex={1}
        onSelect={vi.fn()}
      />
    )
    expect(screen.getByText(/Steam sterilization uses pressurized steam/)).toBeTruthy()
  })

  it('does not show explanation before answering', () => {
    render(
      <QuizQuestion
        question={question}
        questionIndex={0}
        total={10}
        selectedIndex={null}
        onSelect={vi.fn()}
      />
    )
    expect(screen.queryByText(/Steam sterilization uses pressurized steam/)).toBeNull()
  })
})
