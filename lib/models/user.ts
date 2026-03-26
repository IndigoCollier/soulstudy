import { z } from 'zod'

export const UserSchema = z.object({
  uid:         z.string(),
  email:       z.string().email(),
  displayName: z.string().nullable(),
  photoURL:    z.string().url().nullable(),
  createdAt:   z.string().datetime(),
})

export type User = z.infer<typeof UserSchema>

export const SignUpSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name:     z.string().min(1, 'Name is required'),
})

export const LoginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export type SignUpInput = z.infer<typeof SignUpSchema>
export type LoginInput = z.infer<typeof LoginSchema>
