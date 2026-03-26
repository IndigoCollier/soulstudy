import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY

// Guard: don't initialize if env var is missing (e.g. during CI build)
export const anthropic = apiKey
  ? new Anthropic({ apiKey })
  : null
