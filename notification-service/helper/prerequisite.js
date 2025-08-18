const { getPool } = require("../client/pg");

const pool = getPool();

const runScript = async () => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS url_shortner (long_url text unique , short_url varchar(100) unique)`
    );
    await pool.query(
      `CREATE INDEX IF NOT EXISTS short_url_index ON url_shortner(short_url)`
    );
    console.log("Database setup completed successfully.");
  } catch (err) {
    console.log("Error while running prerequisite", err);
    process.exit(1);
  }
};

module.exports = { runScript };
