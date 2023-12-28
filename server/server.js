const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const OpenAI = require('openai');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

const usersRoutes = require('./routes/Users/Users');
const notifsRoutes = require('./routes/Notifs/Notifs');
const sitesRoutes = require('./routes/Sites/Sites');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

app.post('/chatgpt', async (req, res) => {
    try {
      const { question, content } = req.body;

      const response = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: question },
          { role: 'assistant', content: content },
        ],
        model: 'gpt-3.5-turbo',
      });

      const chatGPTResponse = response.choices[0].message.content.trim();
      res.json({ chatGPTResponse });
    } catch (error) {
      console.error('Error processing ChatGPT request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.use(usersRoutes);
app.use(notifsRoutes);
app.use(sitesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
