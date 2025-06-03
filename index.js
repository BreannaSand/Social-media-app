const { v4: uuidv4 } = require('uuid')
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
app.use(express.json())

let db;

(async () => {

    db = await open({
        filename: './test.sqlite',
        driver: sqlite3.Database
    });

    await db.run('PRAGMA foreign_keys = ON');

    app.listen(8080, () => {
        console.log('Server is listening on port 8080');
    });
})();

async function authenticate(req, res, next) {
    const token = req.query.token;

    if (!token) {
        return res.status(401).send();
    }

    try {
        const tokenRow = await db.get('SELECT account_id FROM tokens WHERE token = ?', token);

        if (!tokenRow) {
            return res.status(401).send();
        }

        req.user = { id: tokenRow.account_id };
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const user = await db.get(
            'SELECT * FROM accounts WHERE email = ? AND password = ?',
            email,
            password);

        if (!user) {
            return res.status(401).send();

        }

        const token = uuidv4();

        await db.run(
            'INSERT INTO tokens (token, account_id) VALUES (?,?)',
            token,
            user.id

        );

        res.status(201).json({ token: token });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/messages', authenticate, async (req, res) => {

    const accountId = req.user.id;

    try {

        const messages = await db.all(
            `SELECT * FROM messages
            WHERE sender_id  = ? OR recipient_id = ?
            ORDER BY created ASC`,
            accountId,
            accountId
        );

        res.json(messages);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

app.post('/messages', authenticate, async (req, res) => {
    const senderId = req.user.id;
    const { recipient_id, text } = req.body;

    if (!recipient_id || !text) {
        return res.status(400).json({ error: 'recipient_id and text are required' });
    }

    try {
        await db.run(
            'INSERT INTO messages (sender_id,recipient_id, text)VALUES(?,?,?)',
            senderId,
            recipient_id,
            text
        );

        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.post('/logout', authenticate, async (req, res) => {
    const token = req.query.token;

    try {
        await db.run('DELETE FROM tokens WHERE token = ?', token);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to logout' });
    }
})
