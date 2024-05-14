const express = require('express');
const app = express();
const db = require('./db.js');
require('dotenv').config();

const bodyParser = require('body-parser');
const UserRoutes = require('./Routes/UserRoutes.js');
const BookRoutes = require('./Routes/BookRoutes');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Mounting routes
app.use(UserRoutes);
app.use(BookRoutes);

// Route for homepage
app.get('/', (req, res) => {
    res.send('Hi, welcome to the Book Store');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
