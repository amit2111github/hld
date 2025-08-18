const { getPool } = require("../client/pg");

const pool = getPool();

const scheduleJob = async (cron) => {
  const id = new Date() - 0;
  console.log(cron , " here") ;
  const notifyPayload = JSON.stringify({ id });
  const command = `NOTIFY channel1, '${notifyPayload}'`;

  return pool.query(
    `
        SELECT cron.schedule(
        $1,        
        $2,         
        $3
);`,
    [id, cron, command]
  );
};

module.exports = { scheduleJob };
