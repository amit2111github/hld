const { configDotenv } = require("dotenv");
const express = require("express");
configDotenv();
const rateLimiterRouter = require("./router/ratelimit");
const { PORT } = require("./env");
const { configDb } = require("./client/pg");
const { loadRateLimiterRule } = require("./accessor/rateLimit");
const { configRedis } = require("./client/redis");
const { runScript } = require("./helper/prerequisite");
const bodyParser = require("body-parser");
const { rateLimiter } = require("./middleware/ratelimit");
const app = express();

app.set("trust proxy", true);
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(rateLimiter);

app.get("/api/v1/health", (_, res) => {
  return res.json({ data: { health: "ok" } });
});

app.use("/api/v1/ruleEngine", rateLimiterRouter);

(async () => {
  // do all the stuff before starting server.
  console.log("inside");
  await configDb();
  await configRedis();
  // console.log()
  await Promise.all([runScript(), loadRateLimiterRule()]);
  app.listen(PORT, () => console.log(`RUNNING ON PORT ${PORT}`));
})();
