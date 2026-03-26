import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/integrations/firebase'
import type { Deck, Flashcard } from '@/lib/models/flashcard'

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString()
  if (typeof ts === 'string') return ts
  return new Date().toISOString()
}

export async function createDeck(
  userId: string,
  topic: string,
  cards: Flashcard[],
): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized')

  const ref = await addDoc(collection(db, 'decks'), {
    userId,
    topic,
    cards,
    createdAt: serverTimestamp(),
  })

  return ref.id
}

export async function getDeck(deckId: string): Promise<Deck | null> {
  if (!db) throw new Error('Firestore is not initialized')

  const snap = await getDoc(doc(db, 'decks', deckId))
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    id:        snap.id,
    userId:    data.userId,
    topic:     data.topic,
    cards:     data.cards ?? [],
    createdAt: toISO(data.createdAt),
  }
}

export async function getUserDecks(userId: string): Promise<Deck[]> {
  if (!db) throw new Error('Firestore is not initialized')

  const q = query(
    collection(db, 'decks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )

  const snap = await getDocs(q)
  return snap.docs.map(d => {
    const data = d.data()
    return {
      id:        d.id,
      userId:    data.userId,
      topic:     data.topic,
      cards:     data.cards ?? [],
      createdAt: toISO(data.createdAt),
    }
  })
}
