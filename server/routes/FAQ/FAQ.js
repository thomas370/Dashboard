const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

router.get('/faqs', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM faq');
        connection.end();

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/faqadd', async (req, res) => {
    const { title, description } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO faq (title, description) VALUES (?, ?)', [title, description]);
        connection.end();

        res.status(201).json({ message: 'FAQ created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/faqs/:id', async (req, res) => {
    const faqId = req.params.id;

    if (!faqId) {
      return res.status(400).json({ error: 'FAQ ID is required' });
    }

    try {
      const connection = await mysql.createConnection(dbConfig);
      await connection.execute('DELETE FROM faq WHERE id = ?', [faqId]);
      connection.end();

      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
