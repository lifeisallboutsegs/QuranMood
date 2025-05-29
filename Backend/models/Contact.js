const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new', enum: ['new', 'read', 'replied'] }
}, {
  timestamps: true
});


contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; 