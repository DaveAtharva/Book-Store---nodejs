const Book = require('./../Models/BookSchema');
const User = require('./../Models/UserSchema.js');
const express = require('express');
const router = express.Router();
const { jwtauthmiddleware, generateToken, adminAuthMiddleware } = require('./../jwt');
const jwt = require('jsonwebtoken');

// Get all Books
router.get('/book', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new book
router.post('/book', adminAuthMiddleware, async (req, res) => {
    try {
        const data = req.body;

        // Create a new book object
        const newBook = new Book(data);

        // Save the new book to the database
        const savedBook = await newBook.save();

        // Respond with the saved book object
        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add Multiple Books
router.post('/books/bulk', adminAuthMiddleware , async (req, res) => {
    try {
        // Extract the array of book objects from the request body
        const books = req.body;

        // Insert the books into the database in bulk
        const insertedBooks = await Book.insertMany(books);

        res.status(201).json({ message: 'Books uploaded successfully', books: insertedBooks });
    } catch (error) {
        console.error('Error uploading Books:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// search a book by book name
router.get('/books/search/name/:name', async (req, res) => {
    try {
        const books = await Book.find({ name: { $regex: req.params.name, $options: 'i' } });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// search a book by book author
router.get('/books/search/author/:author', async (req, res) => {
    try {
        const books = await Book.find({ author: { $regex: req.params.author, $options: 'i' } });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// search a book by book category
router.get('/books/search/category/:category', async (req, res) => {
    try {
        const books = await Book.find({ category: { $regex: req.params.category, $options: 'i' } });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search a book by book id
router.get('/book/:id', async (req, res) => {
    const bookId = req.params.id; // Remove parseInt conversion
    const book = await Book.findById(bookId);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
});


//Update a Book
router.put('/books/:id', adminAuthMiddleware, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        console.log({ Message: 'Data Updated Succesfully' });
        res.status(200).json(person);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a Book by ID
router.delete('/books/:id', adminAuthMiddleware , async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        console.log({Message:'Book Deleted Succesfully'});
        res.status(204).json({ message: 'Book Deleted Succesfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a Book in Cart
router.put('/addtocart/:bookid' , async (req, res) => {
    try {
        //searching book
        const bookId = req.params.bookid;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // searching the Person
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if(!req.headers.authorization){
            res.status(500).json({message : 'You are not Logged In'});
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        console.log(decoded);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingCartItem = user.cart.find(item => item.book.equals(bookId));
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            user.cart.push({ book: bookId });
        }

        await user.save();
        
        return res.status(200).json({ message: 'Book added to cart successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove a Book from Cart 
router.delete('/cart/:bookId', async (req, res) => {
    let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if(!req.headers.authorization){
            res.status(500).json({message : 'You are not Logged In'});
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        console.log(decoded);
        const user = await User.findById(decoded.id);

    try {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bookId = req.params.bookId;
        const index = user.cart.findIndex(item => item.book.toString() === bookId);

        if (index === -1) {
            return res.status(404).json({ error: 'Book not found in cart' });
        }

        user.cart.splice(index, 1); // Remove the book from the cart
        await user.save();
        
        res.status(200).json({ message: 'Book removed from cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = router;
