import { Router, Request, Response } from 'express'
import db from '../db'

interface Play {
  id: number
  name: string
  created_at: string
}

interface SqliteError extends Error {
  code?: string
}

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  const plays = db.prepare('SELECT * FROM plays ORDER BY created_at DESC').all() as Play[]
  res.json(plays)
})

router.post('/', (req: Request, res: Response) => {
  const name: string = (req.body?.name ?? '').trim()

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  try {
    const result = db.prepare('INSERT INTO plays (name) VALUES (?)').run(name)
    const play = db
      .prepare('SELECT * FROM plays WHERE id = ?')
      .get(result.lastInsertRowid) as Play
    res.status(201).json(play)
  } catch (err) {
    const sqliteErr = err as SqliteError
    if (sqliteErr.code === 'SQLITE_CONSTRAINT_UNIQUE' || sqliteErr.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'A play with that name already exists' })
      return
    }
    throw err
  }
})

router.patch('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const name: string = (req.body?.name ?? '').trim()

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  const existing = db.prepare('SELECT id FROM plays WHERE id = ?').get(id)
  if (!existing) {
    res.status(404).json({ error: 'Play not found' })
    return
  }

  try {
    db.prepare('UPDATE plays SET name = ? WHERE id = ?').run(name, id)
    const play = db.prepare('SELECT * FROM plays WHERE id = ?').get(id) as Play
    res.json(play)
  } catch (err) {
    const sqliteErr = err as SqliteError
    if (sqliteErr.code === 'SQLITE_CONSTRAINT_UNIQUE' || sqliteErr.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'A play with that name already exists' })
      return
    }
    throw err
  }
})

router.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT id FROM plays WHERE id = ?').get(id)
  if (!existing) {
    res.status(404).json({ error: 'Play not found' })
    return
  }

  db.prepare('DELETE FROM plays WHERE id = ?').run(id)
  res.status(204).send()
})

export default router
