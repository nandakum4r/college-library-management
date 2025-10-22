const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = require("../db"); // DB pool

// --- GET all books with available copies ---
/**
 * @openapi
 * /books:
 *   get:
 *     summary: List all books with available copies
 *     responses:
 *       200:
 *         description: Array of books with available_copies
 */
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
/**
 * @openapi
 * /mybooks/{email}:
 *   get:
 *     summary: Get borrowed books for a student
 *     description: Returns borrow records for a student, with fine calculation per item and total fine.
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Student email (URL-encoded if needed)
 *     responses:
 *       200:
 *         description: A list of borrowed books with fine details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       borrow_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       issue_date:
 *                         type: string
 *                         format: date-time
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       fine:
 *                         type: integer
 *                 totalFine:
 *                   type: integer
 */
app.get("/mybooks/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  try {
    const studentResult = await pool.query(
      "SELECT reg_no FROM student WHERE email_id=$1",
      [email]
    );
    if (!studentResult.rows.length)
      return res.status(404).json({ message: "Student not found" });
    const reg_no = studentResult.rows[0].reg_no;

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

    const today = new Date();
    const booksWithFine = borrowResult.rows.map((book) => {
      const dueDate = new Date(book.due_date);
      let fine = 0;
      if ((book.status === "ISSUED" || book.status === "ISSUE_PENDING") && today > dueDate) {
        fine = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      }
      return { ...book, fine };
    });
    const totalFine = booksWithFine.reduce((acc, b) => acc + b.fine, 0);

    res.json({ books: booksWithFine, totalFine });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- GET active borrow count for a student ---
app.get("/mybooks/activecount/:email", async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  try {
    const studentResult = await pool.query(
      "SELECT reg_no FROM student WHERE email_id=$1",
      [email]
    );
    if (!studentResult.rows.length)
      return res.status(404).json({ message: "Student not found" });
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
/**
 * @openapi
 * /borrow:
 *   post:
 *     summary: Create a borrow request for a student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_id:
 *                 type: string
 *               book_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Borrow request created
 */
app.post("/borrow", async (req, res) => {
  const { email_id, book_id } = req.body;
  if (!email_id || !book_id)
    return res.status(400).json({ message: "email_id and book_id required" });

  try {
    const studentResult = await pool.query(
      "SELECT reg_no FROM student WHERE email_id=$1",
      [email_id]
    );
    if (!studentResult.rows.length)
      return res.status(404).json({ message: "Student not found" });
    const reg_no = studentResult.rows[0].reg_no;

    const activeCountResult = await pool.query(
      "SELECT COUNT(*) FROM book_borrow WHERE reg_no=$1 AND status IN ('ISSUED','ISSUE_PENDING')",
      [reg_no]
    );
    const activeCount = parseInt(activeCountResult.rows[0].count, 10);
    if (activeCount >= 4)
      return res
        .status(400)
        .json({ message: "Borrow limit reached (4 books max)" });

    const copyResult = await pool.query(
      "SELECT copy_id FROM book_copy WHERE book_id=$1 AND status='AVAILABLE' LIMIT 1",
      [book_id]
    );
    if (!copyResult.rows.length)
      return res.status(400).json({ message: "No available copies" });
    const copy_id = copyResult.rows[0].copy_id;

    const token = crypto.randomBytes(4).toString("hex");

    const issue_date = new Date();
    const due_date = new Date();
    due_date.setDate(issue_date.getDate() + 14);

    const insertQuery = `
      INSERT INTO book_borrow
      (reg_no, copy_id, issue_date, due_date, status, renew_count, token)
      VALUES ($1,$2,$3,$4,'ISSUE_PENDING',0,$5)
      RETURNING borrow_id, token, copy_id, issue_date, due_date, status
    `;
    const borrowResult = await pool.query(insertQuery, [
      reg_no,
      copy_id,
      issue_date,
      due_date,
      token,
    ]);

    await pool.query("UPDATE book_copy SET status='ISSUE_PENDING' WHERE copy_id=$1", [
      copy_id,
    ]);

    res.json({ message: "Borrow request created", ...borrowResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- POST return a borrowed copy ---
/**
 * @openapi
 * /return:
 *   post:
 *     summary: Return a borrowed copy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrow_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Return processed
 */
app.post("/return", async (req, res) => {
  const { borrow_id } = req.body;
  if (!borrow_id) return res.status(400).json({ message: "borrow_id required" });

  try {
    const borrowResult = await pool.query(
      "SELECT copy_id, status FROM book_borrow WHERE borrow_id=$1",
      [borrow_id]
    );
    if (!borrowResult.rows.length)
      return res.status(404).json({ message: "Borrow record not found" });

    const { copy_id, status } = borrowResult.rows[0];

    if (status !== "ISSUED" && status !== "ISSUE_PENDING") {
      return res.status(400).json({ message: "Cannot return - not in issued state" });
    }

    await pool.query(
      "UPDATE book_borrow SET status='RETURN_PENDING', return_date=$1 WHERE borrow_id=$2",
      [new Date(), borrow_id]
    );

    res.json({ message: "Return processed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- POST renew a borrowed copy (accepts optional 'days') ---
/**
 * @openapi
 * /renew:
 *   post:
 *     summary: Renew an issued borrow (optional days, default 14)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrow_id:
 *                 type: integer
 *               days:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Renew successful with newDueDate
 */
app.post('/renew', async (req, res) => {
  const { borrow_id, days } = req.body;
  if (!borrow_id) return res.status(400).json({ message: "borrow_id required" });

  let addDays = 14;
  if (typeof days !== "undefined") {
    const n = parseInt(days, 10);
    if (isNaN(n) || n <= 0)
      return res.status(400).json({ message: "Invalid days value" });
    if (n > 60)
      return res
        .status(400)
        .json({ message: "Requested days too large (max 60)" });
    addDays = n;
  }

  try {
    const result = await pool.query(
      "SELECT due_date, renew_count, status FROM book_borrow WHERE borrow_id=$1",
      [borrow_id]
    );
    if (!result.rows.length)
      return res.status(404).json({ message: "Borrow record not found" });

    const { due_date, renew_count, status } = result.rows[0];

    if (status !== "ISSUED")
      return res.status(400).json({ message: "Only issued books can be renewed" });

    const maxRenew = 2;
    if (renew_count >= maxRenew)
      return res.status(400).json({ message: "Renew limit reached" });

    const newDue = new Date(due_date);
    newDue.setDate(newDue.getDate() + addDays);

    await pool.query(
  `UPDATE book_borrow 
   SET due_date=$1, renew_count=renew_count+1, reminder_sent=FALSE 
   WHERE borrow_id=$2`,
  [newDue, borrow_id]
);

    res.json({ message: "Renewed successfully", newDueDate: newDue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all borrow requests
// Fetch all pending borrow requests
app.get("/borrowRequests", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
  bb.borrow_id,
  bb.reg_no,
  s.name AS student_name,
  bb.copy_id,
  b.title AS book_title,
  TO_CHAR(bb.issue_date, 'YYYY-MM-DD') AS issue_date,
  TO_CHAR(bb.due_date, 'YYYY-MM-DD') AS due_date,
  TO_CHAR(bb.return_date, 'YYYY-MM-DD') AS return_date,
  bb.status,
  bb.renew_count
FROM book_borrow bb
JOIN student s ON bb.reg_no = s.reg_no
JOIN book_copy bc ON bb.copy_id = bc.copy_id
JOIN book b ON bc.book_id = b.book_id
WHERE bb.status = 'ISSUE_PENDING'
ORDER BY bb.issue_date DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching borrow requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve or reject a borrow request
// Approve or reject a borrow request with token verification
app.put("/borrowRequests/:id", async (req, res) => {
  const { id } = req.params;
  const { action, token } = req.body; // now expects token for approval

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    if (action === "approve") {
      if (!token) {
        return res.status(400).json({ message: "Token required to approve" });
      }

      // Check token
      const checkResult = await pool.query(
        "SELECT token, status FROM book_borrow WHERE borrow_id=$1",
        [id]
      );

      if (!checkResult.rows.length) {
        return res.status(404).json({ message: "Borrow request not found" });
      }

      const { token: dbToken, status } = checkResult.rows[0];

      if (status !== "ISSUE_PENDING") {
        return res.status(400).json({ message: "Request already processed" });
      }

      if (dbToken !== token) {
        return res.status(400).json({ message: "Invalid token" });
      }

      // Token matches → approve
      await pool.query(
        "UPDATE book_borrow SET status='ISSUED' WHERE borrow_id=$1",
        [id]
      );

      // Update book copy status
      await pool.query(
        "UPDATE book_copy SET status='NOT AVAILABLE' WHERE copy_id=(SELECT copy_id FROM book_borrow WHERE borrow_id=$1)",
        [id]
      );

      return res.json({ message: "Borrow request approved successfully" });
    } else {
      // Reject
      const result = await pool.query(
        "UPDATE book_borrow SET status='REJECTED' WHERE borrow_id=$1 AND status='ISSUE_PENDING'",
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Borrow request not found or already processed" });
      }

      // Revert copy status to AVAILABLE
      await pool.query(
        "UPDATE book_copy SET status='AVAILABLE' WHERE copy_id=(SELECT copy_id FROM book_borrow WHERE borrow_id=$1)",
        [id]
      );

      return res.json({ message: "Borrow request rejected successfully" });
    }
  } catch (err) {
    console.error("❌ Error updating borrow request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all pending return requests
app.get("/returnRequests", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bb.borrow_id,
        bb.reg_no,
        s.name AS student_name,
        bb.copy_id,
        b.title AS book_title,
        TO_CHAR(bb.issue_date, 'YYYY-MM-DD') AS issue_date,
        TO_CHAR(bb.due_date, 'YYYY-MM-DD') AS due_date,
        TO_CHAR(bb.return_date, 'YYYY-MM-DD') AS return_date,
        bb.status,
        bb.renew_count
      FROM book_borrow bb
      JOIN student s ON bb.reg_no = s.reg_no
      JOIN book_copy bc ON bb.copy_id = bc.copy_id
      JOIN book b ON bc.book_id = b.book_id
      WHERE bb.status = 'RETURN_PENDING'
      ORDER BY bb.return_date DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching return requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve or reject a return request with token verification
app.put("/returnRequests/:id", async (req, res) => {
  const { id } = req.params;
  const { action, token } = req.body; // expects token for approval

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    const checkResult = await pool.query(
      "SELECT token, status, copy_id FROM book_borrow WHERE borrow_id=$1",
      [id]
    );

    if (!checkResult.rows.length) {
      return res.status(404).json({ message: "Return request not found" });
    }

    const { token: dbToken, status, copy_id } = checkResult.rows[0];

    if (status !== "RETURN_PENDING") {
      return res.status(400).json({ message: "Request already processed" });
    }

    if (action === "approve") {
      if (!token || dbToken !== token) {
        return res.status(400).json({ message: "Invalid token" });
      }

      // Token matches → approve return
      await pool.query(
        "UPDATE book_borrow SET status='RETURNED' WHERE borrow_id=$1",
        [id]
      );

      // Update book copy to AVAILABLE
      await pool.query(
        "UPDATE book_copy SET status='AVAILABLE' WHERE copy_id=$1",
        [copy_id]
      );

      return res.json({ message: "Return request approved successfully" });
    } else {
      // Reject return → keep status RETURN_PENDING (or optionally revert to ISSUED)
      await pool.query(
        "UPDATE book_borrow SET status='ISSUED' WHERE borrow_id=$1",
        [id]
      );

      await pool.query(
        "UPDATE book_copy SET status='NOT AVAILABLE' WHERE copy_id=$1",
        [copy_id]
      );

      return res.json({ message: "Return request rejected" });
    }
  } catch (err) {
    console.error("❌ Error updating return request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------
// 📬 DAILY REMINDER SERVICE (3-month return reminder)
// -------------------------------------------

const nodemailer = require("nodemailer");
const cron = require("node-cron");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "duplicate995@gmail.com",
    pass: "aucl vtyw nnyi mbkl",
  },
});

// 🔁 Ensure reminder columns exist
(async () => {
  try {
    await pool.query(`
      ALTER TABLE book_borrow ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;
    `);
    await pool.query(`
      ALTER TABLE book_borrow ADD COLUMN IF NOT EXISTS return_reminder_sent BOOLEAN DEFAULT FALSE;
    `);
    console.log("✅ Reminder tracking columns ensured.");
  } catch (err) {
    console.error("⚠️ Could not verify reminder columns:", err);
  }
})();

const generateNotificationId = () => "N" + crypto.randomBytes(4).toString("hex").toUpperCase();

// 🕘 Daily cron job: send reminders
cron.schedule("15 1 * * *", async () => {
  console.log("⏰ Running daily reminder job...");

  try {
    // --- 1️⃣ Renewal reminders ---
    const overdue = await pool.query(`
      SELECT s.name, s.email_id, s.reg_no, b.title, bb.due_date, bb.borrow_id
      FROM book_borrow bb
      JOIN student s ON bb.reg_no = s.reg_no
      JOIN book_copy bc ON bb.copy_id = bc.copy_id
      JOIN book b ON bc.book_id = b.book_id
      WHERE bb.status='ISSUED' AND bb.due_date < CURRENT_DATE
        AND (bb.reminder_sent IS FALSE OR bb.reminder_sent IS NULL)
    `);

    for (const row of overdue.rows) {
      const { name, email_id, reg_no, title, due_date, borrow_id } = row;
      const mail = {
        from: "duplicate995@gmail.com",
        to: email_id,
        subject: `Reminder: "${title}" is overdue`,
        text: `Dear ${name},\n\nYour borrowed book "${title}" was due on ${new Date(due_date).toLocaleDateString()}.\nPlease renew or return it soon.\n\n📚 - College Library`,
      };
      try {
        await transporter.sendMail(mail);
        await pool.query("UPDATE book_borrow SET reminder_sent=TRUE WHERE borrow_id=$1", [borrow_id]);
        const notifId = generateNotificationId();
        await pool.query("INSERT INTO notification (notification_id, reg_no, borrow_id) VALUES ($1,$2,$3)", [notifId, reg_no, borrow_id]);
      } catch (err) { console.error("❌ Email send failed:", err); }
    }

    // --- 2️⃣ Return reminders (3 months from issue date) ---
    const threeMonths = await pool.query(`
      SELECT s.name, s.email_id, s.reg_no, b.title, bb.issue_date, bb.borrow_id
      FROM book_borrow bb
      JOIN student s ON bb.reg_no = s.reg_no
      JOIN book_copy bc ON bb.copy_id = bc.copy_id
      JOIN book b ON bc.book_id = b.book_id
      WHERE bb.status='ISSUED' 
        AND CURRENT_DATE >= (bb.issue_date + INTERVAL '3 months')
        AND (bb.return_reminder_sent IS FALSE OR bb.return_reminder_sent IS NULL)
    `);

    for (const row of threeMonths.rows) {
      const { name, email_id, reg_no, title, issue_date, borrow_id } = row;
      const mail = {
        from: "duplicate995@gmail.com",
        to: email_id,
        subject: `Return Reminder: "${title}" borrowed 3 months ago`,
        text: `Dear ${name},\n\nYou borrowed "${title}" on ${new Date(issue_date).toLocaleDateString()} — 3 months ago.\nPlease return it soon.\n\n📚 - College Library`,
      };
      try {
        await transporter.sendMail(mail);
        await pool.query("UPDATE book_borrow SET return_reminder_sent=TRUE WHERE borrow_id=$1", [borrow_id]);
        const notifId = generateNotificationId();
        await pool.query("INSERT INTO notification (notification_id, reg_no, borrow_id) VALUES ($1,$2,$3)", [notifId, reg_no, borrow_id]);
        console.log(`✅ 3-month return reminder sent to ${email_id}`);
      } catch (err) { console.error("❌ 3-month return reminder failed:", err); }
    }

  } catch (err) {
    console.error("🔥 Daily reminder job failed:", err);
  }
});

module.exports = app;

if (process.env.NODE_ENV !== "test") {
  app.listen(5002, () => console.log("Book service running on port 5002"));
}