const express = require("express");
const { createNotification } = require("../controller/notification");
const router = express.Router();


router.post("/notification/create" , createNotification)
module.exports = router;
