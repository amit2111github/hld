const express = require("express");
const { getLongUrl, generateLongUrl } = require("../controller/urlConverter");
const router = express.Router();


router.post("/generateUrl", generateLongUrl);
router.get("/:short", getLongUrl);

module.exports = router;
