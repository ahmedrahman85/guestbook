<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// GET Route
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Route
app.post('/api/messages', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Name and message are required!' });

  try {
    await pool.query('INSERT INTO messages (name, message) VALUES ($1, $2)', [name, message]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete Route not working
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
  connectionString: 'postgresql://postgres.efeirwmfsmgzxijicxjb:clownmonkeymountain12@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
})

try {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client', err.stack)
      return
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        console.error('Error executing query', err.stack)
      } else {
        console.log('Database connection successful')
      }
    })
  })
} catch (error) {
  console.error('Database connection error:', error)
}
>>>>>>> 541dd4d44307e7e28f3366eaa2054d68c3b495be
