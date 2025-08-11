const express = require("express");
const router = express.Router();


router.post("/rate-limit/create",createRateLimitRule);
module.exports = router;
