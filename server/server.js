import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import { pool } from './db.js'

const app = express()

// cors
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// GET route - Fetch all messages
app.get('/api/messages', async (req, res) => {
  try {
    console.log('Attempting to fetch messages')
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC')
    console.log('Messages fetched successfully:', result.rows)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ 
      error: 'Failed to fetch messages', 
      details: error.message 
    })
  }
})

// new message route
app.post('/api/messages', async (req, res) => {
  const { name, message } = req.body
  
  console.log('Received message:', { name, message })
  
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (name, message, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, message]
    )
    console.log('Message inserted successfully:', result.rows[0])
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error adding message:', error)
    res.status(500).json({ 
      error: 'Failed to add message', 
      details: error.message 
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Waiting for database connections...')
})

// shutdown
process.on('SIGINT', async () => {
  console.log('Closing database connection...')
  await pool.end()
  process.exit(0)
})