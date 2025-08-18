const { Pool, Client } = require("pg");
let pool;
const {
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = require("../env");

(async () => {
  const client = new Client({
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
  await client.connect();
  await client.query("LISTEN channel1");
  client.on("notification", (msg) => {
    console.log("Received notification:", msg.channel, msg.payload);
  });
})();
const configDb = () => {
  if (pool) return;
  pool = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
};
const getPool = () => {
  if (!pool) configDb();
  return pool;
};
module.exports = { configDb, getPool };
