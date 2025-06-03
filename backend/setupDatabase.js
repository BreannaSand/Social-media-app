const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('database.sqlite')

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`)

    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )`)

    db.run(`INSERT INTO users(name) VALUES
        ('Sherie'),
        ('Nils'),
        ('Eric')
    `)


    db.run(`INSERT INTO posts (user_id, content) VALUES
        (1, 'Hello from Sherie!'),
        (2, 'Hello from Nils!'),
        (3, 'Hello from Eric!'),
        (1, 'Hello again from Sherie')`
    )

    console.log('Database setup complete.')

})

db.close()
