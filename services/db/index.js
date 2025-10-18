const prodPool = require("./prodPool");
const testPool = require("./testPool");

const pool = process.env.NODE_ENV === "test" ? testPool : prodPool;

module.exports = pool;
