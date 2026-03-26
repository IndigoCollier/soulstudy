import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/integrations/firebase'
import type { QuizResult, Question } from '@/lib/models/quiz'

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString()
  if (typeof ts === 'string') return ts
  return new Date().toISOString()
}

export async function saveQuizResult(
  userId: string,
  topic: string,
  questions: Question[],
  answers: number[],
  score: number,
): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized')

  const ref = await addDoc(collection(db, 'quizResults'), {
    userId,
    topic,
    questions,
    answers,
    score,
    total:     questions.length,
    createdAt: serverTimestamp(),
  })

  return ref.id
}

export async function getQuizResult(resultId: string): Promise<QuizResult | null> {
  if (!db) throw new Error('Firestore is not initialized')

  const snap = await getDoc(doc(db, 'quizResults', resultId))
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    id:        snap.id,
    userId:    data.userId,
    topic:     data.topic,
    questions: data.questions,
    answers:   data.answers,
    score:     data.score,
    total:     data.total,
    createdAt: toISO(data.createdAt),
  }
}

export async function getUserQuizResults(userId: string): Promise<QuizResult[]> {
  if (!db) throw new Error('Firestore is not initialized')

  const q = query(
    collection(db, 'quizResults'),
    where('userId', '==', userId),
  )

  const snap = await getDocs(q)
  return snap.docs
    .map(d => {
      const data = d.data()
      return {
        id:        d.id,
        userId:    data.userId,
        topic:     data.topic,
        questions: data.questions,
        answers:   data.answers,
        score:     data.score,
        total:     data.total,
        createdAt: toISO(data.createdAt),
      }
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
