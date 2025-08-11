const { getPool } = require("../client/pg");
const { getRedis } = require("../client/redis");
const redis = getRedis();
const pool = getPool();
const addRateLimitRule = async ({ endpoint, limit, ttl }) => {
  return pool.query(
    `INSERT INTO rule_engine (endpoint , limitcount , ttl) values ($1 , $2 , $3) RETURNING *`,
    [endpoint, limit, ttl]
  );
};
const updateRuleEngineInRedis = async (rows) => {
  const endpoints = rows.map((rule) => {
    return JSON.stringify({
      endpoint: rule.endpoint,
      limit: rule.limitcount,
      ttl: rule.ttl,
    });
  });
  await redis.lpush("rate-limit-rules", endpoints);
};

const putAllRuleInRedis = async () => {
  const { rows } = await pool.query(`SELECT * from rule_engine`);
  await redis.del("rate-limit-rules");
  await updateRuleEngineInRedis(rows);
};

const loadRateLimiterRule = async () => {
  try {
    await putAllRuleInRedis();
    let data = await redis.lrange("rate-limit-rules", 0, -1);
    data = data.map((d) => JSON.parse(d));
    console.log(data, " engine rule");
    rateLimiterRules = data;
  } catch (err) {
    console.log("here", err);
    rateLimiterRules = [];
  }
  return rateLimiterRules;
};
module.exports = {
  addRateLimitRule,
  updateRuleEngineInRedis,
  loadRateLimiterRule,
};
