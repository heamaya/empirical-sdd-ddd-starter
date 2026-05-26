import { Router, Request, Response } from 'express'
import db from '../db'
import { reviewPoem } from '../ai/reviewPoem'

interface Poem {
  id: number
  play_id: number
  title: string
  body: string
  created_at: string
}

interface ReviewRow {
  poem_id: number
  grades: string
  suggestions: string
  created_at: string
}

const router = Router({ mergeParams: true })

router.post('/:poemId/review', async (req: Request, res: Response) => {
  const poemId = Number(req.params.poemId)

  const poem = db.prepare('SELECT * FROM poems WHERE id = ?').get(poemId) as Poem | undefined
  if (!poem) {
    res.status(404).json({ error: 'Poem not found' })
    return
  }

  if (!poem.body.trim()) {
    res.status(400).json({ error: 'Poem body is empty' })
    return
  }

  try {
    const result = await reviewPoem(poem.title, poem.body)

    db.prepare(
      `INSERT OR REPLACE INTO reviews (poem_id, grades, suggestions, created_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    ).run(poemId, JSON.stringify(result.grades), JSON.stringify(result.suggestions))

    const row = db.prepare('SELECT * FROM reviews WHERE poem_id = ?').get(poemId) as ReviewRow

    res.json({
      poem_id: row.poem_id,
      grades: JSON.parse(row.grades),
      suggestions: JSON.parse(row.suggestions),
      created_at: row.created_at,
    })
  } catch (err: unknown) {
    const e = err as { type?: string; raw?: string; message?: string }
    if (e?.type === 'parse_error') {
      res.status(500).json({ error: 'Failed to parse AI response — try again' })
      return
    }
    if (e?.message?.includes('credential') || e?.message?.includes('ExpiredToken') || e?.message?.includes('UnrecognizedClient')) {
      res.status(503).json({ error: 'AI review unavailable: AWS credentials missing or expired' })
      return
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:poemId/review', (req: Request, res: Response) => {
  const poemId = Number(req.params.poemId)

  const row = db.prepare('SELECT * FROM reviews WHERE poem_id = ?').get(poemId) as
    | ReviewRow
    | undefined
  if (!row) {
    res.status(404).json({ error: 'No review found' })
    return
  }

  res.json({
    poem_id: row.poem_id,
    grades: JSON.parse(row.grades),
    suggestions: JSON.parse(row.suggestions),
    created_at: row.created_at,
  })
})

export default router
