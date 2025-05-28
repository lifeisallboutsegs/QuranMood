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

// GET routes
router.get("/random/:mood", getVerseByMood);
router.get("/moods", getMoods);
router.get("/search/tag", getVersesByTag);
router.get("/all", getAllVerses);
router.get("/:id", getVerseById);

// POST routes
router.post("/add/:surah/:verse", addVerse);
router.post("/manual", addVerseManual);

// PUT route
router.put("/:id", editVerse);

// DELETE route
router.delete("/:id", deleteVerse);

module.exports = router;
