import { NextRequest, NextResponse } from 'next/server'
import { generateQuiz } from '@/lib/services/quiz.service'
import { GenerateQuizRequestSchema } from '@/lib/models/quiz'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = GenerateQuizRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { topic }   = parsed.data
    const questions   = await generateQuiz(topic)

    return NextResponse.json({ topic, questions })
  } catch (err) {
    console.error('[POST /api/quiz]', err)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
