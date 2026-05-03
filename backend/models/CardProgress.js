const mongoose = require('mongoose');

const CardProgressSchema = new mongoose.Schema({
  userId:        { type: String, required: true },
  cardId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
  status:        { type: String, enum: ['new', 'review', 'mastered'], default: 'new' },
  lastStudiedAt: { type: Date, default: Date.now },
});

CardProgressSchema.index({ userId: 1, cardId: 1 }, { unique: true });

module.exports = mongoose.model('CardProgress', CardProgressSchema);
