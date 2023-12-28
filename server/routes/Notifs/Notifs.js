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

    const [result] = await connection.query('SELECT LAST_INSERT_ID() as faqId');
    const faqId = result[0].faqId;

    const notificationMessage = `Nouvelle FAQ ajoutée : ${title}`;
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['faq', faqId, notificationMessage, expirationDate]);

    res.status(201).json({ message: 'FAQ created successfully' });
    connection.end();
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

    const [faqData] = await connection.execute('SELECT title FROM faq WHERE id = ?', [faqId]);
    const faqTitle = faqData[0].title;

    await connection.execute('DELETE FROM faq WHERE id = ?', [faqId]);

    const notificationMessage = `FAQ supprimée : ${faqTitle}`;
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['faq', faqId, notificationMessage, expirationDate]);

    connection.end();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM events');
    connection.end();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/events', async (req, res) => {
  const { title, start, end, allDay } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute('INSERT INTO events (title, start, end, allDay) VALUES (?, ?, ?, ?)', [title, start, end, allDay]);

    const [result] = await connection.query('SELECT LAST_INSERT_ID() as eventId');
    const eventId = result[0].eventId;

    const notificationMessage = `Nouvel événement ajouté : ${title} le ${start}`;
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['event', eventId, notificationMessage, expirationDate]);

    connection.end();

    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [eventDetails] = await connection.query('SELECT title, start FROM events WHERE id = ?', [eventId]);
    const eventName = eventDetails.length > 0 ? eventDetails[0].title : 'Event';
    const eventStart = eventDetails.length > 0 ? eventDetails[0].start : 'Unknown';

    await connection.execute('DELETE FROM events WHERE id = ?', [eventId]);

    const notificationMessage = `L'événement "${eventName}" prévu pour le ${eventStart} a été supprimé`;
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['event', eventId, notificationMessage, expirationDate]);

    connection.end();

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// NOTIFS
router.get('/notifications', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
      const [rows] = await connection.execute('SELECT * FROM notifications');
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving users');
  } finally {
      await connection.end();
  }
});

router.delete('/notifications/expired', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute('DELETE FROM notifications WHERE expiration_date < NOW()');

    connection.end();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
