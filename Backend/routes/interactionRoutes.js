const express = require("express");
const router = express.Router();
const {
  toggleLike,
  getLikes,
  addComment,
  getComments,
  deleteComment,
  editComment
} = require("../controllers/interactionController");


router.post("/likes/:verseId", toggleLike);
router.get("/likes/:verseId", getLikes);


router.post("/comments/:verseId", addComment);
router.get("/comments/:verseId", getComments);
router.put("/comments/:commentId", editComment);
router.delete("/comments/:commentId", deleteComment);

module.exports = router; 