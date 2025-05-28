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
<<<<<<< HEAD
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
=======
} = require("../controllers/verseController");

router.get("/", getVerseByMood);

router.get("/all", getAllVerses);

router.get("/:id", getVerseById);

router.get("/search/tag", getVersesByTag);

router.post("/add/:surah/:verse", addVerse);

router.post("/manual", addVerseManual);

router.put("/:id", editVerse);

>>>>>>> b6f3e98f09a7758e18f56347718c8ca26319f6ba
router.delete("/:id", deleteVerse);

module.exports = router;
