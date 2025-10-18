const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "library_test", // test DB
  password: "laila2004",
  port: 5432,
});

module.exports = pool;
