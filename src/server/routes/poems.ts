import { Router, Request, Response } from 'express'
import db from '../db'

interface Poem {
  id: number
  play_id: number
  title: string
  body: string
  created_at: string
}

const router = Router({ mergeParams: true })

router.get('/', (req: Request, res: Response) => {
  const playId = Number(req.params.playId)

  const play = db.prepare('SELECT id FROM plays WHERE id = ?').get(playId)
  if (!play) {
    res.status(404).json({ error: 'Play not found' })
    return
  }

  const poems = db
    .prepare('SELECT * FROM poems WHERE play_id = ? ORDER BY created_at DESC')
    .all(playId) as Poem[]
  res.json(poems)
})

router.post('/', (req: Request, res: Response) => {
  const playId = Number(req.params.playId)
  const title: string = (req.body?.title ?? '').trim()
  const body: string = (req.body?.body ?? '').trim()

  if (!title) {
    res.status(400).json({ error: 'Title is required' })
    return
  }

  const play = db.prepare('SELECT id FROM plays WHERE id = ?').get(playId)
  if (!play) {
    res.status(404).json({ error: 'Play not found' })
    return
  }

  const result = db
    .prepare('INSERT INTO poems (play_id, title, body) VALUES (?, ?, ?)')
    .run(playId, title, body)
  const poem = db.prepare('SELECT * FROM poems WHERE id = ?').get(result.lastInsertRowid) as Poem
  res.status(201).json(poem)
})

router.patch('/:id', (req: Request, res: Response) => {
  const playId = Number(req.params.playId)
  const id = Number(req.params.id)

  const existing = db
    .prepare('SELECT * FROM poems WHERE id = ? AND play_id = ?')
    .get(id, playId) as Poem | undefined
  if (!existing) {
    res.status(404).json({ error: 'Poem not found' })
    return
  }

  const title: string =
    req.body?.title !== undefined ? (req.body.title as string).trim() : existing.title
  const body: string =
    req.body?.body !== undefined ? (req.body.body as string).trim() : existing.body

  if (!title) {
    res.status(400).json({ error: 'Title is required' })
    return
  }

  db.prepare('UPDATE poems SET title = ?, body = ? WHERE id = ?').run(title, body, id)
  const poem = db.prepare('SELECT * FROM poems WHERE id = ?').get(id) as Poem
  res.json(poem)
})

router.delete('/:id', (req: Request, res: Response) => {
  const playId = Number(req.params.playId)
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM poems WHERE id = ? AND play_id = ?').get(id, playId)
  if (!existing) {
    res.status(404).json({ error: 'Poem not found' })
    return
  }

  db.prepare('DELETE FROM poems WHERE id = ?').run(id)
  res.status(204).send()
})

export default router
