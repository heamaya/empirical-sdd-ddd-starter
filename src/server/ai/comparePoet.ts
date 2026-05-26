import AnthropicBedrock from '@anthropic-ai/bedrock-sdk'
import { buildComparisonPrompt } from './prompts/comparison'

export type PoetEntry = {
  name: string
  explanation: string
}

export async function comparePoet(title: string, body: string): Promise<PoetEntry[]> {
  const client = new AnthropicBedrock()
  const prompt = buildComparisonPrompt(title, body)

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
    return JSON.parse(raw) as PoetEntry[]
  } catch {
    throw { type: 'parse_error', raw }
  }
}
