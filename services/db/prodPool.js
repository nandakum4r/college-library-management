const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "college_library_db", // production DB
  password: "Miruthu@168",
  port: 5432,
});

module.exports = pool;
