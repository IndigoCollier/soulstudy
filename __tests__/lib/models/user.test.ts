import { describe, it, expect } from 'vitest'
import { LoginSchema, SignUpSchema } from '@/lib/models/user'

describe('LoginSchema', () => {
  it('passes with valid input', () => {
    const result = LoginSchema.safeParse({ email: 'test@example.com', password: 'secret' })
    expect(result.success).toBe(true)
  })

  it('fails when email is missing', () => {
    const result = LoginSchema.safeParse({ password: 'secret' })
    expect(result.success).toBe(false)
  })

  it('fails when email is invalid', () => {
    const result = LoginSchema.safeParse({ email: 'not-an-email', password: 'secret' })
    expect(result.success).toBe(false)
  })

  it('fails when password is empty', () => {
    const result = LoginSchema.safeParse({ email: 'test@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('SignUpSchema', () => {
  it('passes with valid input', () => {
    const result = SignUpSchema.safeParse({
      email: 'new@example.com',
      password: 'strongpassword',
      name: 'Indigo',
    })
    expect(result.success).toBe(true)
  })

  it('fails when password is under 8 characters', () => {
    const result = SignUpSchema.safeParse({
      email: 'new@example.com',
      password: 'short',
      name: 'Indigo',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const passwordError = result.error.issues.find((i) => i.path[0] === 'password')
      expect(passwordError?.message).toBe('Password must be at least 8 characters')
    }
  })

  it('fails when name is missing', () => {
    const result = SignUpSchema.safeParse({
      email: 'new@example.com',
      password: 'strongpassword',
    })
    expect(result.success).toBe(false)
  })

  it('fails when email is invalid', () => {
    const result = SignUpSchema.safeParse({
      email: 'bad-email',
      password: 'strongpassword',
      name: 'Indigo',
    })
    expect(result.success).toBe(false)
  })
})
