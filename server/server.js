const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

const usersRoutes = require('./routes/Users/Users');
const faqRoutes = require('./routes/FAQ/FAQ');
const sitesRoutes = require('./routes/Sites/Sites');

app.use(usersRoutes);
app.use(faqRoutes);
app.use(sitesRoutes);

app.use('/login', usersRoutes);
app.use('/register', usersRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
