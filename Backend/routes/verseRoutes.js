const express = require("express");
const { getVerseByMood } = require("../controllers/verseController");
const router = express.Router();

router.get("/", getVerseByMood);

module.exports = router;
