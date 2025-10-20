process.env.NODE_ENV = "test"; // use test DB

const request = require("supertest");
const app = require("../index"); // make sure index.js exports app
const pool = require("../../db"); // adjust path to your db.js
const crypto = require("crypto");

// Helper: hash password same as app
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

beforeAll(async () => {
  // --- Clean tables ---
  await pool.query("DELETE FROM book_borrow");
  await pool.query("DELETE FROM book_copy");
  await pool.query("DELETE FROM book");
  await pool.query("DELETE FROM student");

  // --- Seed student ---
  await pool.query(`
    INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no, password_hash)
    VALUES ('2023503001', 'Aarav Mehta', 'CSE', 3, 'aarav.mehta@example.com', '9876501234', '${hashPassword("Aarav@123")}')
    ON CONFLICT (email_id) DO NOTHING;
  `);

  // --- Seed books ---
  await pool.query(`
    INSERT INTO book (book_id, title, author)
    VALUES
      (1, 'Clean Code', 'Robert Martin'),
      (2, 'The Pragmatic Programmer', 'Andrew Hunt')
    ON CONFLICT (book_id) DO NOTHING;
  `);

  // --- Seed book copies ---
  await pool.query(`
    INSERT INTO book_copy (copy_id, book_id, status)
    VALUES
      (101, 1, 'AVAILABLE'),
      (102, 1, 'AVAILABLE'),
      (201, 2, 'AVAILABLE')
    ON CONFLICT (copy_id) DO NOTHING;
  `);
});

afterAll(async () => {
  await pool.end();
});

// --- TESTS ---

// 1️⃣ GET /books
test("GET /books - returns books with available copies", async () => {
  const res = await request(app).get("/books");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body[0]).toHaveProperty("title");
});

// 2️⃣ POST /borrow - borrow a book successfully
let borrowRecord;
test("POST /borrow - student borrows a book", async () => {
  const res = await request(app).post("/borrow").send({
    email_id: "aarav.mehta@example.com",
    book_id: 1,
  });
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("borrow_id");
  expect(res.body.status).toBe("ISSUE_PENDING");

  borrowRecord = res.body; // save for later tests
});

// 3️⃣ GET /mybooks/:email - borrowed books
test("GET /mybooks/:email - returns borrowed books", async () => {
  const res = await request(app).get("/mybooks/aarav.mehta@example.com");
  expect(res.statusCode).toBe(200);
  expect(res.body.books.length).toBeGreaterThan(0);
  expect(res.body.books[0]).toHaveProperty("title");
});

// 4️⃣ GET /mybooks/activecount/:email - active borrow count
test("GET /mybooks/activecount/:email - returns active borrow count", async () => {
  const res = await request(app).get("/mybooks/activecount/aarav.mehta@example.com");
  expect(res.statusCode).toBe(200);
  expect(res.body.activeBorrowCount).toBe(1);
});

// 5️⃣ POST /return - return borrowed book
test("POST /return - returns borrowed book", async () => {
  const res = await request(app).post("/return").send({ borrow_id: borrowRecord.borrow_id });
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toMatch(/Return processed/);
});

// 6️⃣ POST /renew - fail if book is not issued
test("POST /renew - fails if not issued", async () => {
  const res = await request(app).post("/renew").send({ borrow_id: borrowRecord.borrow_id });
  expect(res.statusCode).toBe(400);
  expect(res.body.message).toMatch(/Only issued books can be renewed/);
});
