import { describe, it, expect } from 'vitest'
import { QuestionSchema, QuizResultSchema, GenerateQuizRequestSchema } from '@/lib/models/quiz'

const now = new Date().toISOString()

const validQuestion = {
  id:           '1',
  question:     'Which sterilization method uses moist heat under pressure?',
  options:      ['Dry heat', 'Steam autoclave', 'EtO gas', 'UV radiation'],
  correctIndex: 1,
  explanation:  'Steam sterilization (autoclaving) uses pressurized steam at 121°C or 134°C.',
}

describe('QuestionSchema', () => {
  it('accepts a valid question', () => {
    expect(QuestionSchema.safeParse(validQuestion).success).toBe(true)
  })

  it('requires exactly 4 options', () => {
    expect(QuestionSchema.safeParse({ ...validQuestion, options: ['A', 'B', 'C'] }).success).toBe(false)
    expect(QuestionSchema.safeParse({ ...validQuestion, options: ['A', 'B', 'C', 'D', 'E'] }).success).toBe(false)
  })

  it('rejects correctIndex outside 0-3', () => {
    expect(QuestionSchema.safeParse({ ...validQuestion, correctIndex: 4 }).success).toBe(false)
    expect(QuestionSchema.safeParse({ ...validQuestion, correctIndex: -1 }).success).toBe(false)
  })

  it('rejects empty question text', () => {
    expect(QuestionSchema.safeParse({ ...validQuestion, question: '' }).success).toBe(false)
  })
})

describe('QuizResultSchema', () => {
  const validResult = {
    id:        'result-1',
    userId:    'user-abc',
    topic:     'Sterilization methods',
    questions: [validQuestion],
    answers:   [1],
    score:     1,
    total:     1,
    createdAt: now,
  }

  it('accepts a valid quiz result', () => {
    expect(QuizResultSchema.safeParse(validResult).success).toBe(true)
  })

  it('rejects missing userId', () => {
    const { userId: _, ...rest } = validResult
    expect(QuizResultSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects total less than 1', () => {
    expect(QuizResultSchema.safeParse({ ...validResult, total: 0 }).success).toBe(false)
  })
})

describe('GenerateQuizRequestSchema', () => {
  it('accepts a valid topic', () => {
    expect(GenerateQuizRequestSchema.safeParse({ topic: 'Sterilization' }).success).toBe(true)
  })

  it('rejects a topic that is too short', () => {
    expect(GenerateQuizRequestSchema.safeParse({ topic: 'A' }).success).toBe(false)
  })

  it('rejects missing topic', () => {
    expect(GenerateQuizRequestSchema.safeParse({}).success).toBe(false)
  })
})
