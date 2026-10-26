const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });
  if (isValid(username)) return res.status(409).json({ message: "User already exists" });
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

public_users.get('/', (req, res) => res.status(200).send(JSON.stringify(books, null, 4)));

public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book) : res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', (req, res) => {
  const result = Object.values(books).filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
  return res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
  const result = Object.values(books).filter(b => b.title.toLowerCase() === req.params.title.toLowerCase());
  return res.status(200).json(result);
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book.reviews) : res.status(404).json({ message: "Book not found" });
});

const axios = require('axios');
const BASE = "http://localhost:5000";

const getAllBooks = async () => (await axios.get(`${BASE}/`)).data;
const getByISBN = (isbn) => axios.get(`${BASE}/isbn/${isbn}`).then(r => r.data);
const getByAuthor = async (author) => (await axios.get(`${BASE}/author/${encodeURIComponent(author)}`)).data;
const getByTitle = (title) => axios.get(`${BASE}/title/${encodeURIComponent(title)}`).then(r => r.data);

module.exports.general = public_users;