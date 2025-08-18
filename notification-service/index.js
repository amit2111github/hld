const { configDotenv } = require("dotenv");
const express = require("express");
configDotenv();
const indexRouter = require("./router/index");
const { PORT } = require("./env");
const { configDb } = require("./client/pg");
const { configRedis } = require("./client/redis");
const { runScript } = require("./helper/prerequisite");
const bodyParser = require("body-parser");
const app = express();
// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  return res.json({ data: { health: "ok" } });
});
app.use("/api/v1", indexRouter);

(async () => {
  // do all the stuff before starting server.
  await configDb();

  await configRedis();
  await runScript();
  app.listen(PORT, () => console.log(`RUNNING ON PORT ${PORT}`));
})();
