const { getPool } = require("../client/pg");

const pool = getPool();

const runScript = async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS rule_engine (endpoint varchar(100) unique,limitcount int, ttl int default 60)`
    );
    console.log("Database setup completed successfully.");
  } catch (err) {
    console.log("Error while running prerequisite", err);
    process.exit(1);
  }
};

module.exports = { runScript };
