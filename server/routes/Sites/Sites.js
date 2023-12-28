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

        const [result] = await connection.query('SELECT LAST_INSERT_ID() as siteId');
        const siteId = result[0].siteId;

        const notificationMessage = `Le site "${nom}" a été ajouté`;
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['site', siteId, notificationMessage, expirationDate]);

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

      const [siteDetails] = await connection.query('SELECT nom FROM sites WHERE id = ?', [siteId]);
      const deletedSiteName = siteDetails.length > 0 ? siteDetails[0].nom : 'Site';

      await connection.execute('DELETE FROM sites WHERE id = ?', [siteId]);

      const notificationMessage = `Le site "${deletedSiteName}" a été supprimé`;
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['site', siteId, notificationMessage, expirationDate]);

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

      const [siteDetails] = await connection.query('SELECT nom FROM sites WHERE id = ?', [siteId]);
      const previousSiteName = siteDetails.length > 0 ? siteDetails[0].nom : 'Site';

      await connection.execute('UPDATE sites SET nom = ? WHERE id = ?', [nom, siteId]);

      const notificationMessage = `Le site "${previousSiteName}" a été mis à jour`;
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['site', siteId, notificationMessage, expirationDate]);

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

      const notificationMessage = `Nouvel article ajouté : ${title} pour le site ${site}`;
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['article', rows.insertId, notificationMessage, expirationDate]);

      res.json({ message: 'Article added successfully', articleId: rows.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error adding articles');
    } finally {
      connection.end();
    }
});

router.delete('/articles/:id', async (req, res) => {
    const articleId = req.params.id;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [articleDetails] = await connection.query('SELECT title, site FROM articles WHERE id = ?', [articleId]);
        const siteName = articleDetails.length > 0 ? articleDetails[0].site : 'Site';
        const articleTitle = articleDetails.length > 0 ? articleDetails[0].title : 'Article';

        await connection.execute('DELETE FROM articles WHERE id = ?', [articleId]);

        const notificationMessage = `L'article "${articleTitle}" du site "${siteName}" a été supprimé`;
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['article', articleId, notificationMessage, expirationDate]);

        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting articles');
    } finally {
        connection.end();
    }
});



router.get('/articles/:id', async (req, res) => {
    const articleId = req.params.id;

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute('SELECT * FROM articles WHERE id = ?', [articleId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving articles');
    } finally {
        connection.end();
    }
});

router.put('/articles/:id', async (req, res) => {
    const articleId = req.params.id;
    const { title, description, content, image, site } = req.body;

    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const connection = await mysql.createConnection(dbConfig);

    try {
        const [articleDetails] = await connection.query('SELECT title, site FROM articles WHERE id = ?', [articleId]);
        const previousTitle = articleDetails.length > 0 ? articleDetails[0].title : 'Article';
        const previousSite = articleDetails.length > 0 ? articleDetails[0].site : 'Site';

        await connection.execute(
            'UPDATE articles SET title = ?, description = ?, content = ?, image = ?, date_update = ?, site = ? WHERE id = ?',
            [title, description, content, image, currentDate, site, articleId]
        );

        const notificationMessage = `L'article "${previousTitle}" du site "${previousSite}" a été mis à jour`;
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await connection.execute('INSERT INTO notifications (type, element_id, description, expiration_date) VALUES (?, ?, ?, ?)', ['article', articleId, notificationMessage, expirationDate]);

        res.json({ message: 'Article updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating articles');
    } finally {
        connection.end();
    }
});




module.exports = router;

