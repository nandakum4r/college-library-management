const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = require("../db");


// --- GET all books with available copies ---
app.get("/books", async (req, res) => {
  try {
    const query = `
      SELECT b.book_id, b.title, b.author,
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
      available_copies: parseInt(row.available_copies, 10),
    }));
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// --- GET borrowed books for a student with fine calculation ---
app.get("/mybooks/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  try {
    // 1️⃣ Get student's reg_no
    const studentResult = await pool.query("SELECT reg_no FROM student WHERE email_id=$1", [email]);
    if (!studentResult.rows.length) return res.status(404).json({ message: "Student not found" });
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
      WHERE bb.reg_no=$1
      ORDER BY bb.issue_date DESC
    `;
    const borrowResult = await pool.query(borrowQuery, [reg_no]);

    // 3️⃣ Calculate fines (₹1 per overdue day), without changing status
    const today = new Date();
    let totalFine = 0;
    const booksWithFine = borrowResult.rows.map((book) => {
      const dueDate = new Date(book.due_date);
      let fine = 0;
      if ((book.status === "ISSUED" || book.status === "ISSUE_PENDING") && today > dueDate) {
        fine = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      }
      totalFine += fine;
      return { ...book, fine };
    });

    res.json({ books: booksWithFine, totalFine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- GET active borrow count for a student (ISSUED + ISSUE_PENDING) ---
app.get("/mybooks/activecount/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  try {
    const studentResult = await pool.query("SELECT reg_no FROM student WHERE email_id=$1", [email]);
    if (!studentResult.rows.length) return res.status(404).json({ message: "Student not found" });
    const reg_no = studentResult.rows[0].reg_no;

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM book_borrow WHERE reg_no=$1 AND status IN ('ISSUED','ISSUE_PENDING')",
      [reg_no]
    );

    res.json({ activeBorrowCount: parseInt(countResult.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- POST borrow request ---
app.post("/borrow", async (req, res) => {
  const { email_id, book_id } = req.body;
  if (!email_id || !book_id) return res.status(400).json({ message: "email_id and book_id required" });

  try {
    // 1️⃣ Get student's reg_no
    const studentResult = await pool.query("SELECT reg_no FROM student WHERE email_id=$1", [email_id]);
    if (!studentResult.rows.length) return res.status(404).json({ message: "Student not found" });
    const reg_no = studentResult.rows[0].reg_no;

    // 2️⃣ Check borrow limit
    const activeCountResult = await pool.query(
      "SELECT COUNT(*) FROM book_borrow WHERE reg_no=$1 AND status IN ('ISSUED','ISSUE_PENDING')",
      [reg_no]
    );
    const activeCount = parseInt(activeCountResult.rows[0].count, 10);
    if (activeCount >= 4) return res.status(400).json({ message: "Borrow limit reached (4 books max)" });

    // 3️⃣ Find available copy
    const copyResult = await pool.query(
      "SELECT copy_id FROM book_copy WHERE book_id=$1 AND status='AVAILABLE' LIMIT 1",
      [book_id]
    );
    if (!copyResult.rows.length) return res.status(400).json({ message: "No available copies" });
    const copy_id = copyResult.rows[0].copy_id;

    // 4️⃣ Generate token
    const token = crypto.randomBytes(4).toString("hex");

    // 5️⃣ Issue and due dates
    const issue_date = new Date();
    const due_date = new Date();
    due_date.setDate(issue_date.getDate() + 14);

    // 6️⃣ Insert borrow request as ISSUE_PENDING
    const insertQuery = `
      INSERT INTO book_borrow
      (reg_no, copy_id, issue_date, due_date, status, renew_count, token)
      VALUES ($1,$2,$3,$4,'ISSUE_PENDING',0,$5)
      RETURNING borrow_id, token, copy_id, issue_date, due_date, status
    `;
    const borrowResult = await pool.query(insertQuery, [reg_no, copy_id, issue_date, due_date, token]);

    // 7️⃣ Temporarily mark copy as ISSUE_PENDING
    await pool.query("UPDATE book_copy SET status='ISSUE_PENDING' WHERE copy_id=$1", [copy_id]);

    res.json({ message: "Borrow request created", ...borrowResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5002, () => console.log("Book service running on port 5002"));