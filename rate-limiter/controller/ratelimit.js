const { addRateLimitRule, loadRateLimiterRule } = require("../accessor/rateLimit");
const { updateRuleEngineInRedis } = require("../accessor/rateLimit");
const createRateLimitRule = async (req, res) => {
  try {
    const { ttl = 60, endpoint, limit } = req.body;
    if (!endpoint || !limit) {
      return res.status(400).json({ error: "Invalid Argument Passed" });
    }
    const { rows } = await addRateLimitRule({ endpoint, limit, ttl });
    try {
      await updateRuleEngineInRedis(rows);
      await loadRateLimiterRule();
    } catch (err) {
      console.log(err);
    }
    return res.json({ message: "Rule created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createRateLimitRule };
