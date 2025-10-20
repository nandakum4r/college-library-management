process.env.NODE_ENV = "test"; // use test DB

const request = require("supertest");
const app = require("../index");
const pool = require("../../db");
const crypto = require("crypto");

// Helper: hash password same as app
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// --- Setup before all tests ---
beforeAll(async () => {
  // Clear tables
  await pool.query("DELETE FROM book_borrow");
  await pool.query("DELETE FROM book_copy");
  await pool.query("DELETE FROM book");
  await pool.query("DELETE FROM student");

  // Seed student
  await pool.query(
    `INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no, password_hash)
     VALUES ('2023503001', 'Aarav Mehta', 'CSE', 3, 'aarav.mehta@example.com', '9876501234', $1)
     ON CONFLICT (email_id) DO NOTHING;`,
    [hashPassword("Aarav@123")]
  );

  // Seed books
  await pool.query(
    `INSERT INTO book (book_id, title, author)
     VALUES
       ('1', 'Clean Code', 'Robert Martin'),
       ('2', 'The Pragmatic Programmer', 'Andrew Hunt')
     ON CONFLICT (book_id) DO NOTHING;`
  );

  // Seed book copies
  await pool.query(
    `INSERT INTO book_copy (copy_id, book_id, status)
     VALUES
        ('101', '1', 'AVAILABLE'),
        ('102', '1', 'AVAILABLE'),
        ('103', '1', 'AVAILABLE'),
        ('104', '1', 'AVAILABLE'),
        ('201', '2', 'AVAILABLE')
     ON CONFLICT (copy_id) DO NOTHING;`
  );
});

// Close pool after tests
afterAll(async () => {
  await pool.end();
});

// --- TESTS ---
let borrowRecord1;
let borrowRecord2;

// 1️⃣ GET /books
test("GET /books - returns books with available copies", async () => {
  const res = await request(app).get("/books");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body[0]).toHaveProperty("title");
});

// 2️⃣ GET /mybooks/:email - no borrowed books yet
test("GET /mybooks/:email - no borrowed books", async () => {
  const res = await request(app).get("/mybooks/aarav.mehta@example.com");
  expect(res.statusCode).toBe(200);
  expect(res.body.books.length).toBe(0);
  expect(res.body.totalFine).toBe(0);
});

// 3️⃣ GET /mybooks/activecount/:email - zero active borrow
test("GET /mybooks/activecount/:email - zero active borrow", async () => {
  const res = await request(app).get("/mybooks/activecount/aarav.mehta@example.com");
  expect(res.statusCode).toBe(200);
  expect(res.body.activeBorrowCount).toBe(0);
});

// 4️⃣ POST /borrow - successful borrow
test("POST /borrow - student borrows a book", async () => {
  const res = await request(app).post("/borrow").send({
    email_id: "aarav.mehta@example.com",
    book_id: "1",
  });
  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("borrow_id");
  expect(res.body.status).toBe("ISSUE_PENDING");

  borrowRecord1 = res.body;
});

// 5️⃣ POST /borrow - second borrow
test("POST /borrow - student borrows another book", async () => {
  const res = await request(app).post("/borrow").send({
    email_id: "aarav.mehta@example.com",
    book_id: "2",
  });
  expect(res.statusCode).toBe(200);
  borrowRecord2 = res.body;
});

// 6️⃣ POST /borrow - fail if no copy available
test("POST /borrow - fails if no copy available", async () => {
  await pool.query("UPDATE book_copy SET status='ISSUE_PENDING' WHERE book_id='2'");

  const res = await request(app).post("/borrow").send({
    email_id: "aarav.mehta@example.com",
    book_id: "2",
  });
  expect(res.statusCode).toBe(400);
  expect(res.body.message).toMatch(/No available copies/);
});

// 7️⃣ POST /borrow - fail if borrow limit >= 4
test("POST /borrow - fails if borrow limit exceeded", async () => {
  await request(app).post("/borrow").send({ email_id: "aarav.mehta@example.com", book_id: "1" });
  await request(app).post("/borrow").send({ email_id: "aarav.mehta@example.com", book_id: "1" });

  const res = await request(app).post("/borrow").send({ email_id: "aarav.mehta@example.com", book_id: "1" });
  expect(res.statusCode).toBe(400);
  expect(res.body.message).toMatch(/Borrow limit reached/);
});

// 8️⃣ POST /return - successful return
test("POST /return - returns borrowed book", async () => {
  const res = await request(app).post("/return").send({ borrow_id: borrowRecord1.borrow_id });
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toMatch(/Return processed/);
});

// 🔁 9️⃣ POST /renew
describe("POST /renew", () => {
  let borrow_id_issue_pending;
  let borrow_id_issued;
  const studentRegNo = "2023503001";

  beforeAll(async () => {
    // Reset borrow table to avoid borrow limit issues
    await pool.query("DELETE FROM book_borrow");

    // Set copies as ISSUED to simulate borrowed books
    await pool.query("UPDATE book_copy SET status='ISSUED' WHERE copy_id IN ('101', '102')");

    // Seed ISSUE_PENDING borrow
const pendingRes = await pool.query(
  `INSERT INTO book_borrow (reg_no, copy_id, status, renew_count, issue_date, due_date)
   VALUES ($1, '101', 'ISSUE_PENDING', 0, NOW(), NOW() + INTERVAL '14 days')
   RETURNING borrow_id`,
  [studentRegNo]
);
borrow_id_issue_pending = pendingRes.rows[0].borrow_id;

// Seed ISSUED borrow
const issuedRes = await pool.query(
  `INSERT INTO book_borrow (reg_no, copy_id, status, renew_count, issue_date, due_date)
   VALUES ($1, '102', 'ISSUED', 0, NOW(), NOW() + INTERVAL '14 days')
   RETURNING borrow_id`,
  [studentRegNo]
);
borrow_id_issued = issuedRes.rows[0].borrow_id;


    const checkBefore = await pool.query(
      "SELECT borrow_id, reg_no, status, renew_count FROM book_borrow ORDER BY borrow_id"
    );
    console.log("Before renew (seeded rows):", checkBefore.rows);
  });

  test("fails if status is ISSUE_PENDING", async () => {
    const res = await request(app)
      .post("/renew")
      .send({ borrow_id: borrow_id_issue_pending });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Only issued books can be renewed");
  });

  test("renews successfully for ISSUED book", async () => {
    const res = await request(app)
      .post("/renew")
      .send({ borrow_id: borrow_id_issued });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Renewed successfully");

    const check = await pool.query(
      "SELECT renew_count FROM book_borrow WHERE borrow_id=$1",
      [borrow_id_issued]
    );
    expect(check.rows[0].renew_count).toBe(1);
  });

  test("fails if renew count >= 2", async () => {
    await pool.query(
      "UPDATE book_borrow SET renew_count=2 WHERE borrow_id=$1",
      [borrow_id_issued]
    );

    const res = await request(app)
      .post("/renew")
      .send({ borrow_id: borrow_id_issued });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Renew limit reached");
  });

  test("fails with invalid days (negative)", async () => {
    await pool.query(
      "UPDATE book_borrow SET renew_count=0, status='ISSUED' WHERE borrow_id=$1",
      [borrow_id_issued]
    );

    const res = await request(app)
      .post("/renew")
      .send({ borrow_id: borrow_id_issued, days: -5 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid days value");
  });

  test("fails if requested days > 60", async () => {
    const res = await request(app)
      .post("/renew")
      .send({ borrow_id: borrow_id_issued, days: 100 });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Requested days too large (max 60)");
  });
});
