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
  getMoods
} = require("../controllers/verseController");


router.get("/all", getAllVerses);
router.get("/moods", getMoods);
router.get("/search/tag", getVersesByTag);
router.get("/random/:mood", getVerseByMood);


router.post("/manual", addVerseManual);
router.post("/add/:surah/:verse", addVerse);


router.get("/:id", getVerseById);
router.put("/:id", editVerse);
router.delete("/:id", deleteVerse);

module.exports = router;
