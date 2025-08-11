const express = require("express");
const router = express.Router();
const { createRateLimitRule } = require("../controller/ratelimit");

router.post("/create", createRateLimitRule);
module.exports = router;
