const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = require("../db");

// Helper: hash password using SHA-256
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Helper: validate email format
function validateEmail(email) {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
}

// Helper: validate password strength
function validatePassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// --- SIGNUP ---
/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Sign up an existing record (student/librarian/admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, librarian, admin]
 *     responses:
 *       200:
 *         description: Signup successful
 */
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!validateEmail(email))
    return res.status(400).json({ message: "Invalid email format" });
  if (!validatePassword(password))
    return res.status(400).json({ message: "Weak password" });

  const hashedPassword = hashPassword(password);

  let table = "";
  if (role === "student") table = "student";
  else if (role === "librarian") table = "librarian";
  else if (role === "admin") table = "admin";
  else return res.status(400).json({ message: "Invalid role" });

  try {
    // Check if user exists
    const result = await pool.query(`SELECT * FROM ${table} WHERE email_id=$1`, [email]);

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Email not found in records" });

    if (result.rows[0].password_hash)
      return res.status(400).json({ message: "User already signed up" });

    // Update password
    await pool.query(
      `UPDATE ${table} SET password_hash=$1 WHERE email_id=$2`,
      [hashedPassword, email]
    );

    res.json({ message: `Signup successful as ${role}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- LOGIN ---
// --- LOGIN ---
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login with email, password and role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, librarian, admin]
 *     responses:
 *       200:
 *         description: Login successful
 */
app.post("/login", async (req, res) => {
  let { email, password, role } = req.body;

  if (!validateEmail(email))
    return res.status(400).json({ message: "Invalid email format" });

  // Trim input to avoid accidental spaces
  email = email.trim();
  password = password.trim();

  const hashedPassword = hashPassword(password);

  let table = "";
  if (role === "student") table = "student";
  else if (role === "librarian") table = "librarian";
  else if (role === "admin") table = "admin";
  else return res.status(400).json({ message: "Invalid role" });

  try {
    const result = await pool.query(`SELECT * FROM ${table} WHERE email_id=$1`, [email]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const storedHash = result.rows[0].password_hash;

   // console.log("Input password:", password);
    //console.log("Hashed input:", hashedPassword);
    //console.log("Stored hash:", storedHash);

    if (!storedHash)
      return res.status(401).json({ message: "User not signed up yet" });

    if (storedHash !== hashedPassword)
      return res.status(401).json({ message: "Wrong password" });

    res.json({ message: "Login successful", email, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 5005;

if (require.main === module) {
  app.listen(PORT, '127.0.0.1', () => console.log("Auth service running on port 5005"));
}

module.exports = app;
