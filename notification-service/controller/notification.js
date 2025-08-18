const { scheduleJob } = require("../accessor/schedule-job");

const createNotification = async (req, res) => {
  const { cron } = req.body;
  const { rows } = scheduleJob(cron);
  console.log(rows);
  return res.json({ rows });
};

module.exports = { createNotification };
