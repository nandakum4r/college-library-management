const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "college_library_db",
  password: "Miruthu@168",
  port: 5432,
});

// --- GET all books with available copies ---
app.get("/books", async (req, res) => {
  try {
    const query = `
      SELECT b.book_id,
             b.title,
             b.author,
             COALESCE(COUNT(bc.copy_id) FILTER (WHERE bc.status='AVAILABLE'), 0) AS available_copies
      FROM book b
      LEFT JOIN book_copy bc ON b.book_id = bc.book_id
      GROUP BY b.book_id, b.title, b.author
      ORDER BY b.book_id;
    `;
    const result = await pool.query(query);

    const books = result.rows.map((row) => ({
      book_id: row.book_id,
      title: row.title,
      author: row.author,
      available: row.available_copies > 0,
      available_copies: parseInt(row.available_copies, 10),
    }));

    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// --- POST borrow request ---
app.post("/borrow", async (req, res) => {
  const { email_id, book_id } = req.body; // <-- frontend should send email_id

  if (!email_id || !book_id) {
    return res.status(400).json({ message: "email_id and book_id are required" });
  }

  try {
    // 1️⃣ Get the student's reg_no
    const studentResult = await pool.query(
      "SELECT reg_no FROM student WHERE email_id = $1",
      [email_id]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const reg_no = studentResult.rows[0].reg_no;

    // 2️⃣ Find an available copy of the book
    const copyResult = await pool.query(
      "SELECT copy_id FROM book_copy WHERE book_id = $1 AND status='AVAILABLE' LIMIT 1",
      [book_id]
    );

    if (copyResult.rows.length === 0) {
      return res.status(400).json({ message: "No available copies for this book" });
    }

    const copy_id = copyResult.rows[0].copy_id;

    // 3️⃣ Generate unique token
    const token = crypto.randomBytes(4).toString("hex");

    // 4️⃣ Issue and due dates
    const issue_date = new Date();
    const due_date = new Date();
    due_date.setDate(issue_date.getDate() + 14); // 14 days

    // 5️⃣ Insert borrow record
    const insertQuery = `
      INSERT INTO book_borrow
        (reg_no, copy_id, issue_date, due_date, status, renew_count, token)
      VALUES ($1, $2, $3, $4, 'ISSUE_PENDING', 0, $5)
      RETURNING borrow_id, token, copy_id, issue_date, due_date, status
    `;

    const borrowResult = await pool.query(insertQuery, [
      reg_no,
      copy_id,
      issue_date,
      due_date,
      token,
    ]);

    // 6️⃣ Mark book copy as temporarily unavailable
    await pool.query(
      "UPDATE book_copy SET status='ISSUE_PENDING' WHERE copy_id=$1",
      [copy_id]
    );

    res.json({
      message: "Borrow request created successfully",
      ...borrowResult.rows[0],
    });
  } catch (err) {
    console.error("Error processing borrow request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- GET borrowed books for a student ---
// --- GET borrowed books for a student ---
app.get("/mybooks/:email", async (req, res) => {
  const { email } = req.params;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // 1️⃣ Get student's reg_no
    const studentResult = await pool.query(
      "SELECT reg_no, name FROM student WHERE email_id = $1",
      [email]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const reg_no = studentResult.rows[0].reg_no;

    // 2️⃣ Fetch borrow records
    const borrowQuery = `
      SELECT 
        bb.borrow_id,
        b.title,
        b.author,
        bb.issue_date,
        bb.due_date,
        bb.status
      FROM book_borrow bb
      JOIN book_copy bc ON bb.copy_id = bc.copy_id
      JOIN book b ON bc.book_id = b.book_id
      WHERE bb.reg_no = $1
      ORDER BY bb.issue_date DESC
    `;

    const borrowResult = await pool.query(borrowQuery, [reg_no]);

    res.json(borrowResult.rows);
  } catch (err) {
    console.error("Error fetching borrowed books:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Start server ---
const PORT = 5002;
app.listen(PORT, () => console.log(`Book service running on port ${PORT}`));