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


router.get("/random/:mood", getVerseByMood);
router.get("/moods", getMoods);
router.get("/search/tag", getVersesByTag);
router.get("/all", getAllVerses);
router.get("/:id", getVerseById);


router.post("/add/:surah/:verse", addVerse);
router.post("/manual", addVerseManual);
router.put("/:id", editVerse);
router.delete("/:id", deleteVerse);

module.exports = router;
