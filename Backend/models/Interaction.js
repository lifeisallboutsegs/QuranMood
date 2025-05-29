const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  verseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Verse', required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ['like', 'comment'], required: true },
  content: { type: String }, // For comments only
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});


interactionSchema.index({ verseId: 1, userId: 1, type: 1 });
interactionSchema.index({ type: 1 });
interactionSchema.index({ userId: 1 });

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction; 