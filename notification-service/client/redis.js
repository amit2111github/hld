const Redis = require("ioredis");
const {
  REDIS_PORT,
  REDIS_HOST,
  REDIS_USER,
  REDIS_DATABASE,
  REDIS_PASSWORD,
} = require("../env");

let redis;

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

const getValueFromRedis = async (key) => {
  try {
    console.log("key search : " , key);
    const data = await redis.get(key);
    if(data === null) console.log("Not found " , key);
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

module.exports = { configRedis, getValueFromRedis, setKeyInRedis };
