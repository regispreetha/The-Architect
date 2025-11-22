import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import projectRoutes from './routes/projects.js'
import exportRoutes from './routes/export.js'
import libraryRoutes from './routes/library.js'
import { initDatabase } from './models/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// Serve static files
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Initialize database
initDatabase()

// Routes
app.use('/api/projects', projectRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/library', libraryRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
