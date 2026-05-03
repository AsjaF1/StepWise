const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
  userId:          { type: String, required: true, index: true },
  deckId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
  mode:            { type: String, enum: ['flashcard', 'mc', 'memory'], required: true },
  durationSeconds: { type: Number, default: 0 },
  cardsTotal:      { type: Number, default: 0 },
  cardsCorrect:    { type: Number },
  scorePct:        { type: Number },
  completedAt:     { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('StudySession', StudySessionSchema);
