const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = require("../db");

async function updateExpiredBorrows() {
  try {
    // 1️⃣ Find all borrow records with status = 'ISSUE_PENDING'
    const result = await pool.query(
      `SELECT borrow_id, copy_id, issue_date
       FROM book_borrow
       WHERE status = 'ISSUE_PENDING'`
    );

    const today = new Date();

    for (const row of result.rows) {
      const issueDate = new Date(row.issue_date);
      const diffDays = Math.floor((today - issueDate) / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        // 2️⃣ Update book_copy status back to 'AVAILABLE'
        await pool.query(
          `UPDATE book_copy
           SET status = 'AVAILABLE'
           WHERE copy_id = $1`,
          [row.copy_id]
        );

        // 3️⃣ Update borrow record status to 'EXPIRED'
        await pool.query(
          `UPDATE book_borrow
           SET status = 'EXPIRED'
           WHERE borrow_id = $1`,
          [row.borrow_id]
        );

        console.log(
          `Borrow ID ${row.borrow_id} expired. Book copy ${row.copy_id} now AVAILABLE.`
        );
      }
    }

    console.log("Expired borrow check completed.");
  } catch (err) {
    console.error("Error updating expired borrows:", err);
  } finally {
    await pool.end();
  }
}

// Run the script
updateExpiredBorrows();