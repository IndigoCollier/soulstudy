import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/integrations/firebase'
import type { Conversation, ChatMessage } from '@/lib/models/chat'

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString()
  if (typeof ts === 'string') return ts
  return new Date().toISOString()
}

export async function createConversation(userId: string): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized')

  const ref = await addDoc(collection(db, 'conversations'), {
    userId,
    messages:  [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return ref.id
}

export async function appendMessage(
  conversationId: string,
  message: Omit<ChatMessage, 'id'>,
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized')

  const ref = doc(db, 'conversations', conversationId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error(`Conversation ${conversationId} not found`)

  const existing = (snap.data().messages ?? []) as ChatMessage[]
  const newMessage: ChatMessage = { ...message, id: crypto.randomUUID() }

  await updateDoc(ref, {
    messages:  [...existing, newMessage],
    updatedAt: serverTimestamp(),
  })
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  if (!db) throw new Error('Firestore is not initialized')

  const snap = await getDoc(doc(db, 'conversations', conversationId))
  if (!snap.exists()) return null

  const data = snap.data()
  return {
    id:        snap.id,
    userId:    data.userId,
    messages:  data.messages ?? [],
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  }
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  if (!db) throw new Error('Firestore is not initialized')

  const q = query(
    collection(db, 'conversations'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
  )

  const snap = await getDocs(q)
  return snap.docs.map(d => {
    const data = d.data()
    return {
      id:        d.id,
      userId:    data.userId,
      messages:  data.messages ?? [],
      createdAt: toISO(data.createdAt),
      updatedAt: toISO(data.updatedAt),
    }
  })
}
