const mongoose = require('mongoose');
const mongodburl = 'mongodb://0.0.0.0:27017/Books';

// Establishing Connection
mongoose.connect(mongodburl);

// This Object is used to make connection between Node And MongoDB
const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB");
});

db.on('error', (err) => {
    console.log("Connection error MongoDB : ", err);
});

db.on('disconnected', () => {
    console.log("Disconnected from MongoDB");
});

module.exports = db;
