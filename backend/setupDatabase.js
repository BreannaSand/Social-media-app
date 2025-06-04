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
        ('Sara'),
        ('Nils'),
        ('Erik'),
        ('Jennie'),
        ('Sandra'),
        ('My'),
        ('Linnea'),
        ('Carro'),
        ('Elsa')
    `)


    db.run(`INSERT INTO posts (user_id, content) VALUES
    (1, 'Don''t forget to send your child with a water bottle tomorrow!'),
    (2, 'Please remember to label all your child''s belongings. It helps us keep track of their things.'),
    (3, 'We had a fun day learning about colors and shapes today. The kids loved painting with their fingers! Ask your child to show you their favorite color.'),
    (4, 'Spring is here, and we’ll be going outside more often. Please make sure your child has weather-appropriate clothes and sunscreen. Hats are highly recommended. Thank you for your support'),
    (5, 'This week, we are focusing on developing social skills and sharing in the classroom. We encourage the children to express their feelings and listen to their friends. It''s wonderful to see how they grow every day! At home, you can help by reading stories together and talking about emotions. Also, please check that your child''s extra clothes in their cubby are weather-appropriate. Let me know if you need any supplies.'),
    (6, 'I want to take a moment to thank all of you for your continuous support this school year. It''s been a joy watching your children grow, learn, and form friendships. We recently introduced a new daily routine that includes quiet reading time, circle discussions, and outdoor play to promote a balanced day. Your children are adapting wonderfully and showing great enthusiasm. Please ensure they get enough rest each night so they can participate fully. If you notice any changes in behavior or have concerns, don''t hesitate to reach out to me. Communication between home and school is vital for your child''s success. We are also preparing for our upcoming parent-teacher conferences scheduled next month. Details will be sent out soon. Thank you again for being such an important part of our preschool community!'),
    (7, 'Reminder: No school this Friday due to staff training. Enjoy the long weekend!'),
    (8, 'Please check your child''s backpack daily for important notes and artwork.'),
    (8, 'Our theme for the month is ''Animals Around Us.'' The children are excited to learn about different animals and their habitats. We have several fun activities planned, including a visit from the local petting zoo next week. Please fill out the permission slip sent home yesterday and return it by Friday. If you have any questions or want to volunteer during the visit, feel free to reach out. We also continue to work on fine motor skills through crafts and puzzles. Your encouragement at home makes a big difference! Thank you for trusting us with your little ones.')
`)

    console.log('Database setup complete.')

})

db.close()
