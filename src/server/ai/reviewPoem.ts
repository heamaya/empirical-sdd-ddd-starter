import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'
import { buildReviewPrompt } from './prompts/review'

export type ReviewResult = {
  grades: {
    rhythm: { score: number; rationale: string }
    imagery: { score: number; rationale: string }
    emotion: { score: number; rationale: string }
    structure: { score: number; rationale: string }
  }
  suggestions: string[]
}

export async function reviewPoem(title: string, body: string): Promise<ReviewResult> {
  const client = new AnthropicBedrock()
  const prompt = buildReviewPrompt(title, body)

  const message = await client.messages.create({
    model: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const block = message.content[0]
  if (block.type !== 'text') {
    throw { type: 'parse_error', raw: '' }
  }

  let raw = block.text.trim()
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  try {
    return JSON.parse(raw) as ReviewResult
  } catch {
    throw { type: 'parse_error', raw }
  }
}
