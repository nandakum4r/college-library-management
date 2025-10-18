const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
const pool = require("../db");

// --- 1️⃣ FETCH SINGLE USER (for login/dashboard) ---
app.get("/getUser", async (req, res) => {
  const { email, role } = req.query;

  if (!email || !role) {
    return res.status(400).json({ message: "Missing email or role" });
  }

  let table = "";
  if (role === "student") table = "student";
  else if (role === "librarian") table = "librarian";
  else if (role === "admin") table = "admin";
  else return res.status(400).json({ message: "Invalid role" });

  try {
    const result = await pool.query(`SELECT * FROM ${table} WHERE email_id = $1`, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const row = result.rows[0];

    const user = {
      id: row[`${table}_id`] || row.id || null,
      name: row.name,
      email_id: row.email_id,
      phone_no: row.phone_no,
      department: row.department || null,
      year_of_study: row.year_of_study || null,
      reg_no: row.reg_no || null,
      role,
    };

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 2️⃣ FETCH ALL STUDENTS ---
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        reg_no,
        name,
        department,
        year_of_study,
        email_id,
        phone_no
      FROM student
      ORDER BY reg_no;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 3️⃣ FETCH SINGLE STUDENT (for Edit form) ---
app.get("/students/:reg_no", async (req, res) => {
  try {
    const { reg_no } = req.params;
    const result = await pool.query("SELECT * FROM student WHERE reg_no = $1", [reg_no]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 4️⃣ ADD NEW STUDENT ---
app.post("/addStudent", async (req, res) => {
  const { reg_no, name, department, year_of_study, email_id, phone_no } = req.body;

  if (!reg_no || !name || !department || !year_of_study || !email_id || !phone_no) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM student WHERE reg_no = $1 OR email_id = $2",
      [reg_no, email_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const yearInt = parseInt(year_of_study, 10);
    if (isNaN(yearInt)) {
      return res.status(400).json({ message: "Year must be a number" });
    }

    await pool.query(
      `INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [reg_no, name, department, yearInt, email_id, phone_no]
    );

    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("❌ Error adding student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 5️⃣ UPDATE STUDENT ---
app.put("/students/:reg_no", async (req, res) => {
  const { reg_no } = req.params;
  console.log("Fetching student with reg_no:", reg_no);

  const { name, department, year_of_study, email_id, phone_no } = req.body;

  if (!name || !department || !year_of_study || !email_id || !phone_no) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const yearInt = parseInt(year_of_study, 10);
    if (isNaN(yearInt)) {
      return res.status(400).json({ message: "Year must be a number" });
    }

    const result = await pool.query(
      `UPDATE student
       SET name = $1, department = $2, year_of_study = $3, email_id = $4, phone_no = $5
       WHERE reg_no = $6`,
      [name, department, yearInt, email_id, phone_no, reg_no]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("❌ Error updating student:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 6️⃣ DELETE STUDENT ---
app.delete("/students/:reg_no", async (req, res) => {
  try {
    const { reg_no } = req.params;
    const result = await pool.query("DELETE FROM student WHERE reg_no = $1", [reg_no]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// --- 8️⃣ FETCH ALL LIBRARIANS ---
app.get("/librarians", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT librarian_id AS id, name, email_id, phone_no
      FROM librarian
      ORDER BY librarian_id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching librarians:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 9️⃣ FETCH SINGLE LIBRARIAN ---
app.get("/librarians/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT librarian_id AS id, name, email_id, phone_no FROM librarian WHERE librarian_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Librarian not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching librarian:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 🔟 ADD NEW LIBRARIAN ---
app.post("/addLibrarian", async (req, res) => {
  const { librarian_id, name, email_id, phone_no, password_hash } = req.body;

  if (!librarian_id || !name || !email_id || !phone_no) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM librarian WHERE librarian_id = $1 OR email_id = $2",
      [librarian_id, email_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Librarian already exists" });
    }

    await pool.query(
      `INSERT INTO librarian (librarian_id, name, email_id, phone_no, password_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      [librarian_id, name, email_id, phone_no, password_hash]
    );

    res.status(201).json({ message: "Librarian added successfully" });
  } catch (err) {
    console.error("❌ Error adding librarian:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 1️⃣1️⃣ UPDATE LIBRARIAN ---
app.put("/librarians/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email_id, phone_no, password_hash } = req.body;

  if (!name || !email_id || !phone_no  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE librarian
       SET name = $1, email_id = $2, phone_no = $3, password_hash = $4
       WHERE librarian_id = $5`,
      [name, email_id, phone_no, password_hash, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Librarian not found" });
    }

    res.json({ message: "Librarian updated successfully" });
  } catch (err) {
    console.error("❌ Error updating librarian:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- 1️⃣2️⃣ DELETE LIBRARIAN ---
app.delete("/librarians/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM librarian WHERE librarian_id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Librarian not found" });
    }

    res.json({ message: "Librarian deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting librarian:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET library reports


// Example using Express
app.get("/borrowReports", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bb.borrow_id, 
        s.name AS student_name, 
        b.title AS book_title, 
        TO_CHAR(bb.issue_date, 'YYYY-MM-DD') AS issue_date,
        TO_CHAR(bb.return_date, 'YYYY-MM-DD') AS return_date,
        CASE WHEN bb.return_date IS NULL THEN 'Issued' ELSE 'Returned' END AS status
      FROM book_borrow bb
      JOIN student s ON bb.reg_no = s.reg_no
      JOIN book_copy bc ON bb.copy_id = bc.copy_id
      JOIN book b ON bc.book_id = b.book_id
      ORDER BY bb.issue_date DESC
      LIMIT 10;

    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

app.get("/student/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query("SELECT * FROM student WHERE email_id=$1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


if (process.env.NODE_ENV !== "test") {
  const PORT = 5001;
  app.listen(PORT, () => console.log(`✅ User service running on port ${PORT}`));
}

module.exports = { app, pool };