export function buildComparisonPrompt(title: string, body: string): string {
  return `You are a poetry scholar. Read the following poem and identify 1 to 3 widely recognised, well-known poets whose style it most resembles.

Poem title: ${title}

Poem body:
${body}

For each poet, provide their name and a 2–3 sentence stylistic explanation of the resemblance. Name only poets the reader is very likely to know — no obscure or hallucinated names.

Return ONLY a JSON array — no markdown fences, no prose outside the JSON. Use exactly this shape:
[
  {
    "name": "Emily Dickinson",
    "explanation": "The compressed line breaks and slant rhyme echo Dickinson's telegraphic style. The poem's meditation on mortality shares her tendency to treat death as a quiet domestic visitor. The dashes used here for breath rather than grammar are a direct kinship."
  }
]`
}
