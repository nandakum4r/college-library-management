process.env.NODE_ENV = "test"; // ensures test DB

const request = require("supertest");
const app = require("../index");
const pool = require("../../db"); // automatically picks test DB
const crypto = require("crypto");

// Helper: hash password same as app
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

beforeAll(async () => {
  // Clear tables (optional, depending on your DB setup)
  await pool.query("DELETE FROM student");
  await pool.query("DELETE FROM librarian");
  await pool.query("DELETE FROM admin");

  // Seed students
  await pool.query(`
    INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no, password_hash)
    VALUES
    ('2023503001', 'Aarav Mahta', 'CSE', 3, 'aarav.mehta@example.com', '9876501234', '${hashPassword("Aarav@123")}'),
    ('2023503002', 'Diya Sharma', 'ECE', 2, 'diya.sharma@example.com', '9823014567', '')
    ON CONFLICT (email_id) DO NOTHING;
  `);

  // Seed librarians
  await pool.query(`
    INSERT INTO librarian (librarian_id, name, email_id, phone_no, password_hash)
    VALUES ('L004', 'Priya Das', 'priya.das@library.com', '9789023456', '')
    ON CONFLICT (email_id) DO NOTHING;
  `);

  // Seed admins
  await pool.query(`
    INSERT INTO admin (admin_id, name, email_id, phone_no, password_hash)
    VALUES ('A003', 'Rahul Jain', 'rahul.jain@gmail.com', '9823012390', '')
    ON CONFLICT (email_id) DO NOTHING;
  `);
});

afterAll(async () => {
  await pool.end();
});

// ✅ Test 1: Signup success
test("POST /signup - success for student", async () => {
  const res = await request(app).post("/signup").send({
    name: "Diya Sharma",
    email: "diya.sharma@example.com",
    password: "Strong@123",
    role: "student",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toMatch(/Signup successful/);

  const result = await pool.query(
    "SELECT password_hash FROM student WHERE email_id=$1",
    ["diya.sharma@example.com"]
  );
  expect(result.rows[0].password_hash).not.toBeNull();
});

// ✅ Test 2: Signup fail (already signed up)
test("POST /signup - fail if already signed up", async () => {
  const res = await request(app).post("/signup").send({
    name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    password: "Another@123",
    role: "student",
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toMatch(/User already signed up/);
});

// ✅ Test 3: Signup fail (invalid email)
test("POST /signup - invalid email", async () => {
  const res = await request(app).post("/signup").send({
    name: "Test",
    email: "invalidemail",
    password: "Strong@123",
    role: "student",
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe("Invalid email format");
});

// ✅ Test 4: Login success
test("POST /login - success for student", async () => {
  const res = await request(app).post("/login").send({
    email: "aarav.mehta@example.com",
    password: "Aarav@123",
    role: "student",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Login successful");
  expect(res.body.email).toBe("aarav.mehta@example.com");
});

// ✅ Test 5: Login fail (wrong password)
test("POST /login - wrong password", async () => {
  const res = await request(app).post("/login").send({
    email: "aarav.mehta@example.com",
    password: "WrongPass@1",
    role: "student",
  });

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe("Wrong password");
});

// ✅ Test 6: Login fail (not signed up yet)
test("POST /login - not signed up yet", async () => {
  const res = await request(app).post("/login").send({
    email: "priya.das@library.com",
    password: "Priya@123",
    role: "librarian",
  });

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe("User not signed up yet");
});

// ✅ Test 7: Invalid role
test("POST /signup - invalid role", async () => {
  const res = await request(app).post("/signup").send({
    name: "Test User",
    email: "test@example.com",
    password: "Strong@123",
    role: "unknown",
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe("Invalid role");
});
