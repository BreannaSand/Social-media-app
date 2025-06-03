const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')

const app = express()
const PORT = 3001

const db = new sqlite3.Database('database.sqlite')

app.use(cors())
app.use(express.json())

app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(rows)
    })
})

app.get('/posts', (req, res) => {
    const sql = `
    SELECT posts.id, posts.content, posts.created_at, users.id as user_id, users.name
    FROM  posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
    `
    db.all(sql, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json(rows)
    })
})

app.post('/posts', (req, res) => {
    const { user_id, content } = req.body
    if (!user_id || !content) {
        return res.status(400).json({ error: 'Missing user_id or content' })
    }

    const sql = 'INSERT INTO posts (user_id, content) VALUES (?,?)'
    db.run(sql, [user_id, content], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.json({ id: this.lastID, user_id, content })
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
