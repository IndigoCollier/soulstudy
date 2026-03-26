import { z } from 'zod'

export const QuestionSchema = z.object({
  id:            z.string(),
  question:      z.string().min(1),
  options:       z.array(z.string()).length(4),
  correctIndex:  z.number().int().min(0).max(3),
  explanation:   z.string().min(1),
})

export type Question = z.infer<typeof QuestionSchema>

export const QuizResultSchema = z.object({
  id:          z.string(),
  userId:      z.string(),
  topic:       z.string(),
  questions:   z.array(QuestionSchema),
  answers:     z.array(z.number().int()),  // index of selected answer per question
  score:       z.number().int().min(0),
  total:       z.number().int().min(1),
  createdAt:   z.string().datetime(),
})

export type QuizResult = z.infer<typeof QuizResultSchema>

export const GenerateQuizRequestSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters'),
})

export type GenerateQuizRequest = z.infer<typeof GenerateQuizRequestSchema>
