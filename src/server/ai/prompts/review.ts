export function buildReviewPrompt(title: string, body: string): string {
  return `You are a poetry critic. Review the following poem and return ONLY a JSON object — no markdown fences, no prose outside the JSON.

Poem title: ${title}

Poem body:
${body}

Grade the poem on four aspects. For each, provide a score from 1 to 5 and a one-sentence rationale.
Then provide 1 to 3 improvement suggestions. Each suggestion must be a question or a direction — never rewrite any lines from the poem.

Return exactly this JSON shape:
{
  "grades": {
    "rhythm":    { "score": <1-5>, "rationale": "<one sentence>" },
    "imagery":   { "score": <1-5>, "rationale": "<one sentence>" },
    "emotion":   { "score": <1-5>, "rationale": "<one sentence>" },
    "structure": { "score": <1-5>, "rationale": "<one sentence>" }
  },
  "suggestions": ["<suggestion 1>", "<suggestion 2>"]
}`
}
