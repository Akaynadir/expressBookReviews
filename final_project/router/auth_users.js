const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  if (isValid(username)) {
    const user = users.find((user) => user.username === username);
    if (user.password === password) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review;
  const isbn = req.params.isbn;

  const book = books[isbn];
  if (req.session.authorization && req.session.authorization.username) {
    const username = req.session.authorization.username;

    // Vérifier si la clé est "utilisateur1"
    if (book.reviews.hasOwnProperty(username)) {
      // Si oui, afficher la clé et sa valeur associée
      book.reviews[username] = review;
      return res.send("Review modified successfully.");
    } else {
      book.reviews[username] = review;
      return res.send("Review added successfully.");
    }
  } else {
    res.status(403).send("User not logged in.");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (req.session.authorization && req.session.authorization.username) {
    const username = req.session.authorization.username;

    // Vérifier si la clé de l'uutilisateur est présente
    if (book.reviews.hasOwnProperty(username)) {
      // Si oui, afficher la clé et sa valeur associée
      delete book.reviews[username];
      return res.send("Review deleted successfully.");
    } else {
      return res.send("Review doesn't exist.");
    }
  } else {
    res.status(403).send("User not logged in.");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
