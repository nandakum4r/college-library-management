process.env.NODE_ENV = "test";

const request = require("supertest");
const { app } = require("../index");  // <-- destructure here
const pool = require("../../db");

beforeAll(async () => {
  await pool.query("TRUNCATE student, librarian RESTART IDENTITY CASCADE");

  // Seed students
  await pool.query(
    "INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no) VALUES ($1,$2,$3,$4,$5,$6)",
    ["S001", "Alice", "CSE", 2, "alice@example.com", "9000000001"]
  );
  await pool.query(
    "INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no) VALUES ($1,$2,$3,$4,$5,$6)",
    ["S002", "Bob", "ECE", 1, "bob@example.com", "9000000002"]
  );

  // Seed librarians
  await pool.query(
    "INSERT INTO librarian (librarian_id, name, email_id, phone_no, password_hash) VALUES ($1,$2,$3,$4,$5)",
    ["L001", "Carol", "carol@library.com", "9000000003", "hash"]
  );
});

afterAll(async () => {
  await pool.query("TRUNCATE student, librarian RESTART IDENTITY CASCADE");
  await pool.end();
});

describe("User Service Integration Tests", () => {
  // --- STUDENTS ---

  test("GET /students - fetch all students", async () => {
    const res = await request(app).get("/students");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /students/:reg_no - fetch single student", async () => {
    const res = await request(app).get("/students/S001");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Alice");
  });

  test("POST /addStudent - add new student", async () => {
    const newStudent = {
      reg_no: "S003",
      name: "Eve",
      department: "ME",
      year_of_study: 1,
      email_id: "eve@example.com",
      phone_no: "9000000004",
    };
    const res = await request(app).post("/addStudent").send(newStudent);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/added successfully/);

    const dbRes = await pool.query("SELECT * FROM student WHERE reg_no=$1", ["S003"]);
    expect(dbRes.rows.length).toBe(1);
  });

  test("PUT /students/:reg_no - update student", async () => {
    const update = {
      name: "Alice Updated",
      department: "CSE",
      year_of_study: 3,
      email_id: "alice@example.com",
      phone_no: "9111111111",
    };
    const res = await request(app).put("/students/S001").send(update);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/updated successfully/);
  });

  test("DELETE /students/:reg_no - delete student", async () => {
    const res = await request(app).delete("/students/S002");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/);
  });

  // --- LIBRARIANS ---

  test("GET /librarians - fetch all librarians", async () => {
    const res = await request(app).get("/librarians");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /librarians/:id - fetch single librarian", async () => {
    const res = await request(app).get("/librarians/L001");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Carol");
  });

  test("POST /addLibrarian - add new librarian", async () => {
    const newLibrarian = {
      librarian_id: "L002",
      name: "Eve",
      email_id: "eve@library.com",
      phone_no: "9000000005",
      password_hash: "hash",
    };
    const res = await request(app).post("/addLibrarian").send(newLibrarian);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/added successfully/);

    const dbRes = await pool.query("SELECT * FROM librarian WHERE librarian_id=$1", ["L002"]);
    expect(dbRes.rows.length).toBe(1);
  });

  test("PUT /librarians/:id - update librarian", async () => {
    const update = {
      name: "Carol Updated",
      email_id: "carol@library.com",
      phone_no: "9111111112",
      password_hash: "hash2",
    };
    const res = await request(app).put("/librarians/L001").send(update);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/updated successfully/);
  });

  test("DELETE /librarians/:id - delete librarian", async () => {
    const res = await request(app).delete("/librarians/L001");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/);
  });

  // --- SINGLE USER FETCH ---

  test("GET /getUser - fetch single user", async () => {
    const res = await request(app)
      .get("/getUser")
      .query({ email: "alice@example.com", role: "student" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Alice Updated");
  });

  // --- BORROW REPORTS ---

  test("GET /borrowReports - fetch last 10 borrow records", async () => {
    const res = await request(app).get("/borrowReports");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
