import { anthropic } from '@/lib/integrations/anthropic'
import type { Question } from '@/lib/models/quiz'

const SYSTEM_PROMPT = `You are an expert Sterile Processing Technician (SPD) educator.
Generate multiple-choice quiz questions to help students prepare for CRCST and CBSPD certification exams.
Respond ONLY with valid JSON — no markdown, no explanation, no code fences.`

export async function generateQuiz(topic: string): Promise<Question[]> {
  if (!anthropic) throw new Error('Anthropic client is not initialized')

  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 3000,
    system:     SYSTEM_PROMPT,
    messages: [{
      role:    'user',
      content: `Generate 10 multiple-choice questions about: "${topic}"

Return a JSON object in exactly this format:
{
  "questions": [
    {
      "id": "1",
      "question": "The question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct and the others are wrong"
    }
  ]
}

Rules:
- correctIndex is 0-3 (index of the correct option in the options array)
- Make questions exam-style — the kind that appear on CRCST/CBSPD exams
- Include plausible wrong answers, not obvious distractors
- Explanations must be accurate and educational — this is patient safety
- Vary the position of the correct answer (don't always put it at index 0)`,
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.questions)) throw new Error('Invalid response shape')

    return parsed.questions.map((q: {
      id?: string
      question: string
      options: string[]
      correctIndex: number
      explanation: string
    }, i: number) => ({
      id:           q.id ?? String(i + 1),
      question:     q.question,
      options:      q.options,
      correctIndex: q.correctIndex,
      explanation:  q.explanation,
    }))
  } catch {
    throw new Error('Failed to parse quiz response from AI')
  }
}
