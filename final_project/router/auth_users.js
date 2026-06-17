const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 });

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send(JSON.stringify({ message: "Login successful!" },null,2));
    } else {
        return res.status(401).json({ error: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).send(JSON.stringify({message: "Review text is required"}, null, 2));
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({message: "Book not found."});
    }

    book.reviews[username] = review;

    return res.status(200).json({
        message: "Review added/Updated successfully",
        reviews: book.reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({message: "Book not found."});
    }

    if (!book.reviews[username]) {
        return res.status(404).json({message: "No review found for this user on this book."});
    }

    delete book.reviews[username];
    
    return res.status(200).json({
        message: `Review by ${username} deleted successfully`,
        reviews: book.reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
