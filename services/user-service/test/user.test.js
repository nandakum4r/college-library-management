process.env.NODE_ENV = "test";

const request = require("supertest");
const { app } = require("../index");
const pool = require("../../db");

beforeAll(async () => {
  await pool.query("TRUNCATE student, librarian RESTART IDENTITY CASCADE");

  await pool.query(
    "INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no) VALUES ($1,$2,$3,$4,$5,$6)",
    ["S001", "Alice", "CSE", 2, "alice@example.com", "9000000001"]
  );
  await pool.query(
    "INSERT INTO student (reg_no, name, department, year_of_study, email_id, phone_no) VALUES ($1,$2,$3,$4,$5,$6)",
    ["S002", "Bob", "ECE", 1, "bob@example.com", "9000000002"]
  );

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
  // --- GET USER ---
  test("GET /getUser - easy path", async () => {
    const res = await request(app)
      .get("/getUser")
      .query({ email: "alice@example.com", role: "student" });
    expect(res.statusCode).toBe(200);
    expect(res.body.email_id).toBe("alice@example.com");
  });

  test("GET /getUser - missing email", async () => {
    const res = await request(app)
      .get("/getUser")
      .query({ role: "student" });
    expect(res.statusCode).toBe(400);
  });

  test("GET /getUser - invalid role", async () => {
    const res = await request(app)
      .get("/getUser")
      .query({ email: "alice@example.com", role: "teacher" });
    expect(res.statusCode).toBe(400);
  });

  test("GET /getUser - user not found", async () => {
    const res = await request(app)
      .get("/getUser")
      .query({ email: "noone@example.com", role: "student" });
    expect(res.statusCode).toBe(404);
  });

  // --- STUDENTS ---
  test("GET /students - easy path", async () => {
    const res = await request(app).get("/students");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /students/:reg_no - easy path", async () => {
    const res = await request(app).get("/students/S001");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Alice");
  });

  test("GET /students/:reg_no - not found", async () => {
    const res = await request(app).get("/students/S999");
    expect(res.statusCode).toBe(404);
  });

  test("POST /addStudent - easy path", async () => {
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
  });

  test("POST /addStudent - missing field", async () => {
    const res = await request(app)
      .post("/addStudent")
      .send({ reg_no: "S004", name: "NoDept" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /addStudent - already exists", async () => {
    const res = await request(app)
      .post("/addStudent")
      .send({
        reg_no: "S001",
        name: "Duplicate",
        department: "CSE",
        year_of_study: 2,
        email_id: "alice@example.com",
        phone_no: "9999999999",
      });
    expect(res.statusCode).toBe(400);
  });

  test("POST /addStudent - invalid year", async () => {
    const res = await request(app)
      .post("/addStudent")
      .send({
        reg_no: "S005",
        name: "WrongYear",
        department: "CSE",
        year_of_study: "abc",
        email_id: "wrongyear@example.com",
        phone_no: "9000000007",
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /students/:reg_no - easy path", async () => {
    const update = {
      name: "Alice Updated",
      department: "CSE",
      year_of_study: 3,
      email_id: "alice@example.com",
      phone_no: "9111111111",
    };
    const res = await request(app).put("/students/S001").send(update);
    expect(res.statusCode).toBe(200);
  });

  test("PUT /students/:reg_no - invalid year", async () => {
    const res = await request(app)
      .put("/students/S001")
      .send({
        name: "Alice BadYear",
        department: "CSE",
        year_of_study: "x",
        email_id: "alice@example.com",
        phone_no: "9111111111",
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /students/:reg_no - missing field", async () => {
    const res = await request(app)
      .put("/students/S001")
      .send({ name: "Incomplete" });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /students/:reg_no - not found", async () => {
    const update = {
      name: "Ghost",
      department: "CSE",
      year_of_study: 1,
      email_id: "ghost@example.com",
      phone_no: "9000000010",
    };
    const res = await request(app).put("/students/S999").send(update);
    expect(res.statusCode).toBe(404);
  });

  test("DELETE /students/:reg_no - easy path", async () => {
    const res = await request(app).delete("/students/S002");
    expect(res.statusCode).toBe(200);
  });

  test("DELETE /students/:reg_no - not found", async () => {
    const res = await request(app).delete("/students/S999");
    expect(res.statusCode).toBe(404);
  });

  // --- LIBRARIANS ---
  test("GET /librarians - easy path", async () => {
    const res = await request(app).get("/librarians");
    expect(res.statusCode).toBe(200);
  });

  test("GET /librarians/:id - easy path", async () => {
    const res = await request(app).get("/librarians/L001");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Carol");
  });

  test("GET /librarians/:id - not found", async () => {
    const res = await request(app).get("/librarians/L999");
    expect(res.statusCode).toBe(404);
  });

  test("POST /addLibrarian - easy path", async () => {
    const newLib = {
      librarian_id: "L002",
      name: "Librarian Eve",
      email_id: "eve@library.com",
      phone_no: "9000000005",
      password_hash: "hash",
    };
    const res = await request(app).post("/addLibrarian").send(newLib);
    expect(res.statusCode).toBe(201);
  });

  test("POST /addLibrarian - missing field", async () => {
    const res = await request(app)
      .post("/addLibrarian")
      .send({ librarian_id: "L003" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /addLibrarian - already exists", async () => {
    const res = await request(app)
      .post("/addLibrarian")
      .send({
        librarian_id: "L001",
        name: "Duplicate",
        email_id: "carol@library.com",
        phone_no: "9999999999",
        password_hash: "hash",
      });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /librarians/:id - easy path", async () => {
    const update = {
      name: "Carol Updated",
      email_id: "carol@library.com",
      phone_no: "9111111112",
      password_hash: "hash2",
    };
    const res = await request(app).put("/librarians/L001").send(update);
    expect(res.statusCode).toBe(200);
  });

  test("PUT /librarians/:id - missing field", async () => {
    const res = await request(app)
      .put("/librarians/L001")
      .send({ name: "Incomplete" });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /librarians/:id - not found", async () => {
    const update = {
      name: "Ghost Librarian",
      email_id: "ghost@library.com",
      phone_no: "9999999999",
      password_hash: "hash",
    };
    const res = await request(app).put("/librarians/L999").send(update);
    expect(res.statusCode).toBe(404);
  });

  test("DELETE /librarians/:id - easy path", async () => {
    const res = await request(app).delete("/librarians/L001");
    expect(res.statusCode).toBe(200);
  });

  test("DELETE /librarians/:id - not found", async () => {
    const res = await request(app).delete("/librarians/L999");
    expect(res.statusCode).toBe(404);
  });

  // --- STUDENT BY EMAIL ---
  test("GET /student/:email - easy path", async () => {
    const res = await request(app).get("/student/alice@example.com");
    expect(res.statusCode).toBe(200);
    expect(res.body.email_id).toBe("alice@example.com");
  });

  test("GET /student/:email - not found", async () => {
    const res = await request(app).get("/student/nobody@example.com");
    expect(res.statusCode).toBe(404);
  });
});
