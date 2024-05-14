// Book Schema
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description:{type : String},  // Added description field
    language: {type: String }   // Added language field
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
