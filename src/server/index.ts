import express from 'express'
import path from 'path'
import playsRouter from './routes/plays'
import poemsRouter from './routes/poems'
import reviewsRouter from './routes/reviews'
import comparisonsRouter from './routes/comparisons'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

app.use(express.json())

app.use('/plays', playsRouter)
app.use('/plays/:playId/poems', poemsRouter)
app.use('/plays/:playId/poems', reviewsRouter)
app.use('/plays/:playId/poems', comparisonsRouter)

const clientDist = path.resolve(process.cwd(), 'dist/client')
app.use(express.static(clientDist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Versify server running on http://localhost:${PORT}`)
})
