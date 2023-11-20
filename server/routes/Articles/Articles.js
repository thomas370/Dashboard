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



module.exports = router;

