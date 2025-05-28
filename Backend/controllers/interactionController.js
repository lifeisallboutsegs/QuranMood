const {
  readInteractions,
  writeInteractions,
  validateUserInput,
  validateVerseInput,
  validateCommentInput,
  findLike,
  findComment,
  createLike,
  createComment,
  formatLikeResponse,
  formatCommentResponse
} = require("../utils/interactionUtils");

exports.toggleLike = async (req, res) => {
  try {
    const { verseId } = req.params;
    const { userId, userName } = req.body;

    validateVerseInput(verseId);
    validateUserInput(userId, userName);

    const interactions = await readInteractions();
    const likeIndex = findLike(interactions, verseId, userId);

    if (likeIndex === -1) {
   
      interactions.likes.push(createLike(verseId, userId, userName));
    } else {
    
      interactions.likes.splice(likeIndex, 1);
    }

    await writeInteractions(interactions);

    const verseLikes = interactions.likes.filter(
      (like) => like.verseId === verseId
    );
    res.json({
      message: likeIndex === -1 ? "Verse liked" : "Like removed",
      likes: verseLikes.length
    });
  } catch (err) {
    console.error("Error in toggleLike:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error toggling like",
      error: err.message
    });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { verseId } = req.params;
    validateVerseInput(verseId);

    const interactions = await readInteractions();
    const likes = interactions.likes.filter((like) => like.verseId === verseId);

    res.json(formatLikeResponse(likes));
  } catch (err) {
    console.error("Error in getLikes:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error fetching likes",
      error: err.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { verseId } = req.params;
    const { userId, userName, content } = req.body;

    validateVerseInput(verseId);
    validateUserInput(userId, userName);
    validateCommentInput(content);

    const interactions = await readInteractions();
    const newComment = createComment(verseId, userId, userName, content);

    interactions.comments.push(newComment);
    await writeInteractions(interactions);

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (err) {
    console.error("Error in addComment:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error adding comment",
      error: err.message
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { verseId } = req.params;
    validateVerseInput(verseId);

    const interactions = await readInteractions();
    const comments = interactions.comments
      .filter((comment) => comment.verseId === verseId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      comments: formatCommentResponse(comments)
    });
  } catch (err) {
    console.error("Error in getComments:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error fetching comments",
      error: err.message
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    validateUserInput(userId, "dummy"); // We only need userId for deletion
    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const interactions = await readInteractions();
    const commentIndex = findComment(interactions, commentId, userId);

    if (commentIndex === -1) {
      return res.status(404).json({
        message: "Comment not found or unauthorized"
      });
    }

    interactions.comments.splice(commentIndex, 1);
    await writeInteractions(interactions);

    res.json({
      message: "Comment deleted successfully"
    });
  } catch (err) {
    console.error("Error in deleteComment:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error deleting comment",
      error: err.message
    });
  }
};

exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    validateUserInput(userId, "dummy");
    validateCommentInput(content);
    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const interactions = await readInteractions();
    const commentIndex = findComment(interactions, commentId, userId);

    if (commentIndex === -1) {
      return res.status(404).json({
        message: "Comment not found or unauthorized"
      });
    }

    interactions.comments[commentIndex] = {
      ...interactions.comments[commentIndex],
      content,
      updatedAt: new Date().toISOString()
    };

    await writeInteractions(interactions);

    res.json({
      message: "Comment updated successfully",
      comment: formatCommentResponse([interactions.comments[commentIndex]])[0]
    });
  } catch (err) {
    console.error("Error in editComment:", err);
    res.status(err.message.includes("required") ? 400 : 500).json({
      message: err.message || "Error editing comment",
      error: err.message
    });
  }
};
