// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Use the routes
app.use('/', routes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
