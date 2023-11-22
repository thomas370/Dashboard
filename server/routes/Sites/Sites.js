const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

router.get('/sites', async (req, res) => {
    try{
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM sites');
        connection.end();

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/sitesadd', async (req, res) => {
    const { nom } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [existingSites] = await connection.execute('SELECT * FROM sites WHERE nom = ?', [nom]);

        if (existingSites.length > 0) {
            res.status(409).json({ error: 'Site name already exists' });
        } else {
            await connection.execute('INSERT INTO sites (nom) VALUES (?)', [nom]);
            res.status(201).json({ message: 'Site created successfully' });
        }

        connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/sites/:id', async (req, res) => {
    const siteId = req.params.id;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM sites WHERE id = ?', [siteId]);
        connection.end();

        res.status(200).json({ message: 'Site deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/sites/:id', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM sites WHERE id = ?', [req.params.id]);
        connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Site not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/sites/:id', async (req, res) => {
    const siteId = req.params.id;
    const { nom } = req.body;

    if (!siteId || !nom) {
        return res.status(400).json({ error: 'Site ID and name are required' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [existingSites] = await connection.execute('SELECT * FROM sites WHERE nom = ? AND id <> ?', [nom, siteId]);

        if (existingSites.length > 0) {
            return res.status(409).json({ error: 'Site name already exists' });
        }

        await connection.execute('UPDATE sites SET nom = ? WHERE id = ?', [nom, siteId]);
        connection.end();

        res.status(200).json({ message: 'Site updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ARTICLES

router.get('/articles', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM articles');
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error retrieving articles');
    } finally {
        await connection.end();
    }
});

router.post('/articlesadd', async (req, res) => {
    const { title, description, content, image, site } = req.body;

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute(
            'INSERT INTO articles (title, description, content, image, date_creation, date_update, site) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, content, image, currentDate, currentDate, site]
        );

        res.json({ message: 'Article added successfully', articleId: rows.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding articles');
    } finally {
        connection.end();
    }
});

module.exports = router;

