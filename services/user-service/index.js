const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection
const pool = require("../db");

// --- 1️⃣ FETCH SINGLE USER (for login/dashboard) ---
/**
 * @openapi
 * /getUser:
 *   get:
 *     summary: Fetch a single user by email and role
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User object
 */
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
/**
 * @openapi
 * /students:
 *   get:
 *     summary: Get list of students
 *     responses:
 *       200:
 *         description: Array of students
 */
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
/**
 * @openapi
 * /students/{reg_no}:
 *   get:
 *     summary: Get a single student by reg_no
 *     parameters:
 *       - in: path
 *         name: reg_no
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student object
 */
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
/**
 * @openapi
 * /addStudent:
 *   post:
 *     summary: Add a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reg_no:
 *                 type: string
 *               name:
 *                 type: string
 *               department:
 *                 type: string
 *               year_of_study:
 *                 type: integer
 *               email_id:
 *                 type: string
 *               phone_no:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student added
 */
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
/**
 * @openapi
 * /students/{reg_no}:
 *   put:
 *     summary: Update a student
 *     parameters:
 *       - in: path
 *         name: reg_no
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               department:
 *                 type: string
 *               year_of_study:
 *                 type: integer
 *               email_id:
 *                 type: string
 *               phone_no:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated
 */
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
/**
 * @openapi
 * /students/{reg_no}:
 *   delete:
 *     summary: Delete a student
 *     parameters:
 *       - in: path
 *         name: reg_no
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student deleted
 */
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
/**
 * @openapi
 * /librarians:
 *   get:
 *     summary: Get list of librarians
 *     responses:
 *       200:
 *         description: Array of librarians
 */
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
/**
 * @openapi
 * /librarians/{id}:
 *   get:
 *     summary: Get a single librarian by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Librarian object
 */
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
/**
 * @openapi
 * /addLibrarian:
 *   post:
 *     summary: Add a new librarian
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               librarian_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               email_id:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               password_hash:
 *                 type: string
 *     responses:
 *       201:
 *         description: Librarian added
 */
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
/**
 * @openapi
 * /librarians/{id}:
 *   put:
 *     summary: Update librarian
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email_id:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               password_hash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Librarian updated
 */
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
/**
 * @openapi
 * /librarians/{id}:
 *   delete:
 *     summary: Delete librarian
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Librarian deleted
 */
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
/**
 * @openapi
 * /borrowReports:
 *   get:
 *     summary: Get recent borrow reports
 *     responses:
 *       200:
 *         description: Array of borrow report entries
 */
app.get("/borrowReports", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        bb.borrow_id, 
        s.name AS student_name, 
        b.title AS book_title, 
        TO_CHAR(bb.issue_date, 'YYYY-MM-DD') AS issue_date,
        TO_CHAR(bb.due_date, 'YYYY-MM-DD') AS due_date,
        TO_CHAR(bb.return_date, 'YYYY-MM-DD') AS return_date,
        CASE
          WHEN bb.status = 'Issue Pending' THEN 'Issue Pending'
          WHEN bb.return_date IS NOT NULL THEN 'Returned'
          WHEN bb.due_date < CURRENT_DATE THEN 'Past Due Date'
          ELSE 'Issued'
        END AS current_status,
        CASE
          WHEN bb.status = 'Issue Pending' THEN 'orange'
          WHEN bb.return_date IS NOT NULL THEN 'green'
          WHEN bb.due_date < CURRENT_DATE THEN 'red'
          ELSE 'blue'
        END AS status_color
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


/**
 * @openapi
 * /student/{email}:
 *   get:
 *     summary: Get student by email
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student object
 */
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
  app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
}

module.exports = { app, pool };