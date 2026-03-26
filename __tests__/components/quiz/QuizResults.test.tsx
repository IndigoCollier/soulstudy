import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QuizResults from '@/components/quiz/QuizResults'

describe('QuizResults', () => {
  const defaultProps = {
    topic:   'Sterilization methods',
    score:   8,
    total:   10,
    onRetry: vi.fn(),
    onNew:   vi.fn(),
  }

  it('displays the percentage score', () => {
    render(<QuizResults {...defaultProps} />)
    expect(screen.getByText('80%')).toBeTruthy()
  })

  it('displays score out of total', () => {
    render(<QuizResults {...defaultProps} />)
    expect(screen.getByText('8/10')).toBeTruthy()
  })

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = vi.fn()
    render(<QuizResults {...defaultProps} onRetry={onRetry} />)
    fireEvent.click(screen.getByText('Retry same topic'))
    expect(onRetry).toHaveBeenCalled()
  })

  it('calls onNew when new quiz button is clicked', () => {
    const onNew = vi.fn()
    render(<QuizResults {...defaultProps} onNew={onNew} />)
    fireEvent.click(screen.getByText(/New quiz/))
    expect(onNew).toHaveBeenCalled()
  })
})
