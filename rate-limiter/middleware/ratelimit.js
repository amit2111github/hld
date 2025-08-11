const { loadRateLimiterRule } = require("../accessor/rateLimit");
const {
  getRateLimiterRules,
  incrementApiAccessCount,
} = require("../client/redis");
const { getClientIpAddress, getEndPoint } = require("../helper/index");
const rateLimiter = async (req, res, next) => {
  try {
    const ipAddress = getClientIpAddress(req);
    const endPoint = getEndPoint(req);
    let rateLimiterRule = getRateLimiterRules();
    if (!rateLimiterRule) {
      console.log("loaded Rule engine");
      rateLimiterRule = await loadRateLimiterRule();
    }
    const rule = rateLimiterRule.find(
      ({ endpoint }) => endPoint.indexOf(endpoint) === 0
    );
    if (rule) {
      // increment in redis
      const data = await incrementApiAccessCount(
        ipAddress + ":" + rule.endpoint,
        rule.limit,
        rule.ttl
      );
      if (data === 0) {
        return res.status(429).json({
          error: "Too Many Request try after some time",
          message: "Please try after some time.",
        });
      }
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
      message: "Error while doing rate limiting.",
    });
  }
};

module.exports = { rateLimiter };
