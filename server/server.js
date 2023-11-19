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
app.use(bodyParser.json());

const usersRoutes = require('./routes/Users/Users');


app.use(usersRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});