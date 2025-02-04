import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

//fetch

app.get('/api/messages', async (req, res) => {

    try { const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
    } catch (err) {
    res.status(500).json({error: err.message});
    }
});

// Post Route: Add a new message
app.post('/api/messages', async (re, res) => {
    const { name, message} =req.body;
    if (!name|| !message ) return res.status(400).json({error: 'Name and messages are required!'});

    try {
        await pool.query('INSERT INTO MESSAGES (name, message) VALUES ($1,$2)', [name, message]);
        res.status(201).json({ success: true});
        }catch (err) {
            res.status(500).jsonn({ error: err.message});

        }
    });

//delete not workin
app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM messages WHERE id = $1', [id]);
        res.json({ success:true });
    } catch (err) {
        res.status(500).json({ error: err.message});
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port running on port ${PORT}`));
