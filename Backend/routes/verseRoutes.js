const express = require("express");
const router = express.Router();
const {
  getVerseByMood,
  addVerse,
  addVerseManual,
  editVerse,
  deleteVerse,
  getAllVerses,
  getVerseById,
  getVersesByTag,
} = require("../controllers/verseController");

router.get("/", getVerseByMood);

router.get("/all", getAllVerses);

router.get("/:id", getVerseById);

router.get("/search/tag", getVersesByTag);

router.post("/add/:surah/:verse", addVerse);

router.post("/manual", addVerseManual);

router.put("/:id", editVerse);

router.delete("/:id", deleteVerse);

module.exports = router;
