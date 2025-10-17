const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "college_library_db",
  password: "Miruthu@168", 
  port: 5432,
});

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
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!validateEmail(email))
    return res.status(400).json({ message: "Invalid email format" });

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

    if (!result.rows[0].password_hash)
      return res.status(401).json({ message: "User not signed up yet" });

    if (result.rows[0].password_hash !== hashedPassword)
      return res.status(401).json({ message: "Wrong password" });

    res.json({ message: "Login successful", email, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("Auth service running on port 5000"));