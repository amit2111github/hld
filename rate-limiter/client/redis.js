const Redis = require("ioredis");
const {
  REDIS_PORT,
  REDIS_HOST,
  REDIS_USER,
  REDIS_DATABASE,
  REDIS_PASSWORD,
} = require("../env");
const { putAllRuleInRedis } = require("../accessor/rateLimit");

let redis, rateLimiterRules;

const configRedis = () => {
  if (redis) return;
  redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST, // Redis host
    username: REDIS_USER, // needs Redis >= 6
    password: REDIS_PASSWORD,
    db: REDIS_DATABASE,
  });
};
const getRedis = () => {
  if (!redis) configRedis();
  return redis;
};

const getValueFromRedis = async (key) => {
  try {
    console.log("key search : ", key);
    const data = await redis.get(key);
    if (data === null) console.log("Not found ", key);
    return data;
  } catch (err) {
    console.log(err);
  }
};
const setKeyInRedis = async (key, value, ttl = 7200) => {
  try {
    await redis.set(key, value, "EX", ttl);
    console.log("set key");
  } catch (err) {
    console.log(err);
  }
};
const getRateLimiterRules = () => {
  return rateLimiterRules;
};
// is atomic operation so no race condition.
const incrementApiAccessCount = async (key, limit , ttl) => {
  const luaScript = `
  local accesscount = tonumber(redis.call("GET", KEYS[1]) or "0")
  local limit = tonumber(ARGV[1])
  local ttl = tonumber(ARGV[2])
  if accesscount >= limit then
    return 0
  end
  if accesscount == 0 then
    redis.call("SET" , KEYS[1],1 , "EX" , ttl)
  else 
    redis.call("INCRBY" , KEYS[1],1)
  end
  return 1
`;
  return redis.eval(luaScript, 1, key, limit , ttl);
};

module.exports = {
  configRedis,
  getValueFromRedis,
  setKeyInRedis,
  incrementApiAccessCount,
  getRateLimiterRules,
  getRedis,
};
