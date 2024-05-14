
Node.js Book Store Project
This repository contains a Node.js-based book store project with user login, user registration, and various book-related routes. It provides functionalities such as adding, updating, deleting books, searching for books by name, author, category, and ID, as well as adding and removing books from the user's cart.

Project Structure
The project structure consists of the following files and directories:

server.js: Entry point of the application.
db.js: Database configuration file.
jwt.js: JWT token generation and verification logic.
Models/BookSchema.js: MongoDB schema for books.
Models/UserSchema.js: MongoDB schema for users.
Routes/BookRoutes.js: Express routes for book-related functionalities.
Routes/UserRoutes.js: Express routes for user authentication and registration.
Functionalities
User Authentication: User login and registration functionalities are implemented using JWT authentication.

Book Routes:

Get all books
Add a new book
Add multiple books
Search for books by name, author, or category
Get a book by ID
Update a book
Delete a book
User Cart Operations:

Add a book to the user's cart
Remove a book from the user's cart
Usage
Clone the repository.
Install dependencies using npm install.
Start the server using node server.js.
Access the API endpoints using tools like Postman or integrate them into your frontend application.
Dependencies
Express.js: Web framework for Node.js.
Mongoose: MongoDB object modeling for Node.js.
jsonwebtoken: JWT implementation for Node.js.
Note
Ensure that you have MongoDB installed and running locally or provide the appropriate MongoDB URI in the db.js file for database connectivity.
