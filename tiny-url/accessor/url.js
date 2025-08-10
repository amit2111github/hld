const { getPool } = require("../client/pg");
const { getValueFromRedis, setKeyInRedis } = require("../client/redis");
const pool = getPool();

const getUrlFromShortUrl = async ({ shortUrl }) => {
  const redisValue = await getValueFromRedis(shortUrl);
  if (redisValue) {
    console.log("CACHE HIT");
    return { rows: [{ short_url: shortUrl, long_url: redisValue }] };
  }
  console.log("CACHE MISS");
  const { rows } = await pool.query(
    `SELECT * FROM url_shortner WHERE short_url = $1`,
    [shortUrl]
  );
  // set in redis
  if (rows[0]) {
    setKeyInRedis(shortUrl, rows[0].long_url, 7200);
  }
  return { rows };
};

const insertLongUrl = async ({ shortUrl, longUrl }) => {
  return pool.query(
    `INSERT INTO url_shortner (short_url , long_url) values ($1 ,$2)`,
    [shortUrl, longUrl]
  );
};

module.exports = { getUrlFromShortUrl, insertLongUrl };
