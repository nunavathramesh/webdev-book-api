const express = require("express");
const app = express();
const PORT = 3000;

// Middleware for JSON body parsing
app.use(express.json());

// In-memory book storage
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari" },
  { id: 5, title: "The Great Gatsby", author: "F. Scott Fitzgerald" }
];

// ✅ Middleware to trim and remove newlines from URLs
app.use((req, res, next) => {
  req.url = req.url.replace(/\r?\n|\r/g, ""); // remove newline characters
  req.url = req.url.trim(); // remove extra spaces
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("📚 Welcome to the Books API! Use /books to see all books.");
});

// GET /books - return all books
app.get("/books", (req, res) => {
  res.json(books);
});

// POST /books - add a new book (unique title)
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ message: "Title and Author required" });

  const exists = books.some(b => b.title.toLowerCase() === title.toLowerCase());
  if (exists) return res.status(400).json({ message: "Book with this title already exists" });

  const newBook = { id: books.length > 0 ? books[books.length - 1].id + 1 : 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id - update book by ID
app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (title) {
    const exists = books.some(b => b.title.toLowerCase() === title.toLowerCase() && b.id !== bookId);
    if (exists) return res.status(400).json({ message: "Another book with this title already exists" });
    book.title = title;
  }
  if (author) book.author = author;

  res.json(book);
});

// DELETE /books/:id - remove book by ID
app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const deletedBook = books.splice(index, 1);
  res.json(deletedBook[0]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});