const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = require("../db");

// ✅ 1️⃣ Get all books
app.get("/books", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.book_id AS id,
        b.title,
        b.author,
        b.publisher,
        b.publication_year,
        b.category,
        b.total_copies,
        COALESCE(COUNT(bc.copy_id) FILTER (WHERE bc.status='AVAILABLE'), 0) AS available_copies
      FROM book b
      LEFT JOIN book_copy bc ON b.book_id = bc.book_id
      GROUP BY b.book_id, b.title, b.author, b.publisher, b.publication_year, b.category, b.total_copies
      ORDER BY b.book_id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 2️⃣ Add new book and its copies
app.post("/books", async (req, res) => {
  const {
    id,
    title,
    author,
    publisher,
    publication_year,
    category,
    total_copies,
    copies = [],
  } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  const book_id = id || `B${Math.floor(1000 + Math.random() * 9000)}`;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert main book record
    await client.query(
      `INSERT INTO book (book_id, title, author, publisher, publication_year, category, total_copies)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        book_id,
        title,
        author,
        publisher || null,
        publication_year ? parseInt(publication_year) : null,
        category || null,
        parseInt(total_copies || 1),
      ]
    );

    // Insert copies
    const copiesCount = parseInt(total_copies || 1);
    for (let i = 0; i < copiesCount; i++) {
      const copy_id = `${book_id}-C${(i + 1).toString().padStart(3, "0")}`;
      const copy = copies[i] || {};

      await client.query(
        `INSERT INTO book_copy 
          (copy_id, book_id, status, isbn, edition, price, acquisition_date)
         VALUES ($1, $2, 'AVAILABLE', $3, $4, $5, CURRENT_DATE)`,
        [
          copy_id,
          book_id,
          copy.isbn || null,
          copy.edition || null,
          copy.price ? parseFloat(copy.price) : null,
        ]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Book added successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error adding book:", err);
    res.status(500).json({ message: "Error adding book" });
  } finally {
    client.release();
  }
});

// ✅ 3️⃣ Update existing book
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, publisher, publication_year, category, total_copies } = req.body;

  try {
    const result = await pool.query(
      `UPDATE book
       SET title=$1, author=$2, publisher=$3, publication_year=$4, category=$5, total_copies=$6
       WHERE book_id=$7`,
      [
        title,
        author,
        publisher || null,
        publication_year ? parseInt(publication_year) : null,
        category || null,
        parseInt(total_copies || 1),
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (err) {
    console.error("❌ Error updating book:", err);
    res.status(500).json({ message: "Error updating book" });
  }
});

// ✅ 4️⃣ Delete book and all its copies
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM book_copy WHERE book_id = $1", [id]);
    const result = await client.query("DELETE FROM book WHERE book_id = $1", [id]);
    await client.query("COMMIT");

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error deleting book:", err);
    res.status(500).json({ message: "Error deleting book" });
  } finally {
    client.release();
  }
});

const PORT = 5003;
app.listen(PORT, () => console.log(`📚 Inventory service running on port ${PORT}`));

module.exports = app;