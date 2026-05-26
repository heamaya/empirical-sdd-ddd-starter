import { Router, Request, Response } from 'express'
import db from '../db'
import { comparePoet, PoetEntry } from '../ai/comparePoet'

interface Poem {
  id: number
  play_id: number
  title: string
  body: string
  created_at: string
}

interface ComparisonRow {
  poem_id: number
  poets: string
  created_at: string
}

const router = Router({ mergeParams: true })

router.post('/:poemId/comparison', async (req: Request, res: Response) => {
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
    const poets = await comparePoet(poem.title, poem.body)

    db.prepare(
      `INSERT OR REPLACE INTO comparisons (poem_id, poets, created_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)`,
    ).run(poemId, JSON.stringify(poets))

    const row = db.prepare('SELECT * FROM comparisons WHERE poem_id = ?').get(poemId) as ComparisonRow

    res.json({
      poem_id: row.poem_id,
      poets: JSON.parse(row.poets) as PoetEntry[],
      created_at: row.created_at,
    })
  } catch (err: unknown) {
    const e = err as { type?: string; raw?: string; message?: string }
    if (e?.type === 'parse_error') {
      res.status(500).json({ error: 'Failed to parse AI response — try again' })
      return
    }
    if (e?.message?.includes('credential') || e?.message?.includes('ExpiredToken') || e?.message?.includes('UnrecognizedClient')) {
      res.status(503).json({ error: 'AI comparison unavailable: AWS credentials missing or expired' })
      return
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:poemId/comparison', (req: Request, res: Response) => {
  const poemId = Number(req.params.poemId)

  const row = db.prepare('SELECT * FROM comparisons WHERE poem_id = ?').get(poemId) as
    | ComparisonRow
    | undefined
  if (!row) {
    res.status(404).json({ error: 'No comparison found' })
    return
  }

  res.json({
    poem_id: row.poem_id,
    poets: JSON.parse(row.poets) as PoetEntry[],
    created_at: row.created_at,
  })
})

export default router
