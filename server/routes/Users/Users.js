const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const authMiddleware = require('../../UtilServer/AuthMiddleware');

const router = express.Router();
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length > 0) {
            return res.status(409).json({ error: 'Email already in use.' });
        }

        await connection.execute('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, 'user']);
        res.status(201).send('User created');
    } catch (error) {
        res.status(500).send('Error registering user');
    } finally {
        await connection.end();
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    } finally {
        await connection.end();
    }
});

router.get('/user-role',authMiddleware,  async (req, res) => {
    const token = req.headers['authorization'];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT role FROM users WHERE id = ?', [decoded.id]);
        const userRole = rows[0]?.role;
        if (userRole) {
            res.json({ role: userRole });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving role');
    }
});

router.get('/users', authMiddleware, async (req, res) => {
    console.log("Reached /users route");
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM users');
        console.log(rows);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving users');
    } finally {
        await connection.end();
    }
});





module.exports = router;
