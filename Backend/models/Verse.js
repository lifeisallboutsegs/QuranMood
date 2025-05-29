const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
  reference: {
    surah: { type: Number, required: true },
    ayah: { type: Number, required: true },
    text: { type: String }
  },
  arabic: { type: String, required: true },
  english: { type: String, required: true },
  bangla: { type: String },
  context: { type: String },
  mood: [{ type: String }],
  tags: [{ type: String }],
  source: { type: String },
  translation_info: {
    english_translator: { type: String },
    bangla_translator: { type: String },
    language: { type: String, default: 'multi' }
  },
  created_by: {
    userId: { type: String },
    userName: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  updated_by: {
    userId: { type: String },
    userName: { type: String },
    timestamp: { type: Date }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
verseSchema.index({ 'reference.surah': 1, 'reference.ayah': 1 }, { unique: true });
verseSchema.index({ mood: 1 });
verseSchema.index({ tags: 1 });
verseSchema.index({ 'created_by.userId': 1 });
verseSchema.index({ 'updated_by.userId': 1 });

const Verse = mongoose.model('Verse', verseSchema);

module.exports = Verse; 