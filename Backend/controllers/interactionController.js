const Interaction = require('../models/Interaction');

exports.toggleLike = async (req, res) => {
  try {
    const { verseId } = req.params;
    const { userId, userName } = req.body;

    if (!verseId || !userId || !userName) {
      return res.status(400).json({
        message: "Please log in to like verses",
        error: "Authentication required"
      });
    }

    const existingLike = await Interaction.findOne({
      verseId,
      userId,
      type: 'like'
    });

    if (existingLike) {
      await Interaction.findByIdAndDelete(existingLike._id);
      const likes = await Interaction.countDocuments({ verseId, type: 'like' });
      return res.json({
        message: "Like removed",
        likes
      });
    }

    const like = new Interaction({
      verseId,
      userId,
      userName,
      type: 'like'
    });

    await like.save();
    const likes = await Interaction.countDocuments({ verseId, type: 'like' });

    res.json({
      message: "Verse liked successfully",
      likes
    });
  } catch (err) {
    console.error("Error in toggleLike:", err);
    res.status(500).json({
      message: "Failed to update like status",
      error: "Server error",
      details: err.message
    });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const { verseId } = req.params;

    if (!verseId) {
      return res.status(400).json({
        message: "Verse ID is required"
      });
    }

    const likes = await Interaction.find({ verseId, type: 'like' })
      .sort({ createdAt: -1 });

    res.json({
      count: likes.length,
      likes: likes.map(like => ({
        userId: like.userId,
        userName: like.userName,
        createdAt: like.createdAt
      }))
    });
  } catch (err) {
    console.error("Error in getLikes:", err);
    res.status(500).json({
      message: "Error fetching likes",
      error: err.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { verseId } = req.params;
    const { userId, userName, content } = req.body;

    if (!verseId || !userId || !userName || !content) {
      return res.status(400).json({
        message: "Please log in and provide a comment",
        error: "Missing required fields"
      });
    }

    const comment = new Interaction({
      verseId,
      userId,
      userName,
      type: 'comment',
      content
    });

    await comment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        id: comment._id,
        userId: comment.userId,
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt
      }
    });
  } catch (err) {
    console.error("Error in addComment:", err);
    res.status(500).json({
      message: "Failed to add comment",
      error: "Server error",
      details: err.message
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { verseId } = req.params;

    if (!verseId) {
      return res.status(400).json({
        message: "Verse ID is required"
      });
    }

    const comments = await Interaction.find({ verseId, type: 'comment' })
      .sort({ createdAt: -1 });

    res.json({
      comments: comments.map(comment => ({
        id: comment._id,
        userId: comment.userId,
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt
      }))
    });
  } catch (err) {
    console.error("Error in getComments:", err);
    res.status(500).json({
      message: "Error fetching comments",
      error: err.message
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!commentId || !userId) {
      return res.status(400).json({
        message: "Please log in to delete comments",
        error: "Authentication required"
      });
    }

    const comment = await Interaction.findOne({
      _id: commentId,
      userId,
      type: 'comment'
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you don't have permission to delete it",
        error: "Not found or unauthorized"
      });
    }

    await Interaction.findByIdAndDelete(commentId);

    res.json({
      message: "Comment deleted successfully"
    });
  } catch (err) {
    console.error("Error in deleteComment:", err);
    res.status(500).json({
      message: "Failed to delete comment",
      error: "Server error",
      details: err.message
    });
  }
};

exports.editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    if (!commentId || !userId || !content) {
      return res.status(400).json({
        message: "Please log in and provide comment content",
        error: "Missing required fields"
      });
    }

    const comment = await Interaction.findOne({
      _id: commentId,
      userId,
      type: 'comment'
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you don't have permission to edit it",
        error: "Not found or unauthorized"
      });
    }

    comment.content = content;
    await comment.save();

    res.json({
      message: "Comment updated successfully",
      comment: {
        id: comment._id,
        userId: comment.userId,
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt
      }
    });
  } catch (err) {
    console.error("Error in editComment:", err);
    res.status(500).json({
      message: "Failed to update comment",
      error: "Server error",
      details: err.message
    });
  }
};
