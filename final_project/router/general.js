const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .send(JSON.stringify({ message: "User successfully registered. Now you can login" },null,2));
    } else {
      return res.status(409).json({ error: "User already exists!" });
    }
  } else {
    return res.status(400).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
    .then((books) => {
      return res.status(200).send(JSON.stringify(books, null, 2));
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
});

// Async-Await with Axios
public_users.get("/books/fetch", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: err.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 2));
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Async-Await with Axios
public_users.get("/books/fetch/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Book not found", error: err.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const result = {};

    for (const [id, book] of Object.entries(books)) {
      if (book.author.toLowerCase().includes(author.toLowerCase())) {
        result[id] = book;
      }
    }

    if (Object.keys(result).length > 0) {
      resolve(result);
    } else {
      reject(`No books found for author: ${author}`);
    }
  })
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Async-Await with Axios
public_users.get("/books/fetch/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`,
    );
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (err) {
    return res
      .status(404)
      .json({ message: "No books found for given author", error: err.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const title = req.params.title;
    const result = {};

    for (const [id, book] of Object.entries(books)) {
      if (book.title.toLowerCase().includes(title.toLowerCase())) {
        result[id] = book;
      }
    }

    if (Object.keys(result).length > 0) {
      resolve(result);
    } else {
      reject(`No books found for title: ${title}`);
    }
  })
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Async-Await with Axios
public_users.get("/books/fetch/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`,
    );
    return res.status(200).send(JSON.stringify(response.data, null, 2));
  } catch (err) {
    return res
      .status(404)
      .json({ message: "No books found for given title", error: err.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  } else {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2));
  }
});

module.exports.general = public_users;
