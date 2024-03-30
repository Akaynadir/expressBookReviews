const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.send({ message: "username &/ password are not provided." });
  }

  users.forEach((user) => {
    if (user.username === username) {
      return res.send({ message: "Username already exists" });
    }
  });

  users.push({ username: username, password: password });
  return res.send({ message: "The User Has been added!" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  if (books) {
    res.send(JSON.stringify(books));
  } else {
    res.status(500).send("Error: Books data not available");
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  // Create a promise to retrieve book details
  const getBookDetails = new Promise((resolve, reject) => {
    // Check if the book with the given ISBN exists
    const book = books[isbn];
    if (book) {
      // Book found, resolve the promise with book details
      resolve(book);
    } else {
      // Book not found, reject the promise with an error
      reject("Book not found for ISBN: " + isbn);
    }
  });

  // Handle the promise
  getBookDetails
    .then((book) => {
      // Book details retrieved successfully, send the book details
      res.send(book);
    })
    .catch((error) => {
      // Error occurred while retrieving book details, send error response
      res.status(404).send(error);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const authorBooks = [];

  // Create a promise to retrieve book details
  const getBookDetails = new Promise((resolve, reject) => {
    // Check if the book with the given ISBN exists
    const bookKeys = Object.keys(books);
    if (bookKeys) {
      // Book found, resolve the promise with book details
      resolve(bookKeys);
    } else {
      // Book not found, reject the promise with an error
      reject("Book not found for author: " + author);
    }
  });

  // Handle the promise
  getBookDetails
    .then((bookKeys) => {
      // Itérer à travers les clés et vérifier si l'auteur correspond
      bookKeys.forEach((key) => {
        const book = books[key];
        if (book.author === author) {
          authorBooks.push(book);
        }
      });

      // Envoyer la liste des livres de l'auteur
      res.send(authorBooks);
    })
    .catch((error) => {
      // Error occurred while retrieving book details, send error response
      res.status(404).send(error);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleList = [];

  // Create a promise to retrieve book details
  const getBookDetails = new Promise((resolve, reject) => {
    // Check if the book with the given ISBN exists
    const bookKeys = Object.keys(books);
    if (bookKeys) {
      // Book found, resolve the promise with book details
      resolve(bookKeys);
    } else {
      // Book not found, reject the promise with an error
      reject("Book not found for title: " + title);
    }
  });
  getBookDetails
    .then((bookKeys) => {
      // Itérer à travers les clés et vérifier si l'auteur correspond
      bookKeys.forEach((key) => {
        const book = books[key];
        if (book.title === title) {
          titleList.push(book);
        }
      });

      // Envoyer la liste des livres de l'auteur
      res.send(titleList);
    })
    .catch((error) => {
      // Error occurred while retrieving book details, send error response
      res.status(404).send(error);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
