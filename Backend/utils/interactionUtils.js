const fs = require('fs').promises;
const path = require('path');

const INTERACTIONS_FILE = path.join(__dirname, '../data/interactions.json');

const readInteractions = async () => {
  try {
    const data = await fs.readFile(INTERACTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with default structure
      const defaultData = { likes: [], comments: [] };
      await fs.writeFile(INTERACTIONS_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    throw error;
  }
};

const writeInteractions = async (data) => {
  await fs.writeFile(INTERACTIONS_FILE, JSON.stringify(data, null, 2));
};

const validateUserInput = (userId, userName) => {
  if (!userId || !userName) {
    throw new Error("User ID and name are required");
  }
};

const validateVerseInput = (verseId) => {
  if (!verseId) {
    throw new Error("Verse ID is required");
  }
};

const validateCommentInput = (content) => {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new Error("Valid comment content is required");
  }
};

const findLike = (interactions, verseId, userId) => {
  return interactions.likes.findIndex(
    like => like.verseId === verseId && like.userId === userId
  );
};

const findComment = (interactions, commentId, userId) => {
  return interactions.comments.findIndex(
    comment => comment.id === commentId && comment.userId === userId
  );
};

const createLike = (verseId, userId, userName) => ({
  verseId,
  userId,
  userName,
  createdAt: new Date().toISOString()
});

const createComment = (verseId, userId, userName, content) => ({
  id: Date.now().toString(),
  verseId,
  userId,
  userName,
  content,
  createdAt: new Date().toISOString()
});

const formatLikeResponse = (likes) => ({
  count: likes.length,
  likes: likes.map(like => ({
    userId: like.userId,
    userName: like.userName,
    createdAt: like.createdAt
  }))
});

const formatCommentResponse = (comments) => comments.map(comment => ({
  id: comment.id,
  userId: comment.userId,
  userName: comment.userName,
  content: comment.content,
  createdAt: comment.createdAt
}));

module.exports = {
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
}; 