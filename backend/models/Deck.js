const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
  userId:    { type: String, required: true, index: true },
  name:      { type: String, required: true, trim: true },
  theme:     { type: String, enum: ['amber','terracotta','sage','lavender','navy','rose'], default: 'amber' },
  emoji:     { type: String, default: '📖' },
  cardCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Deck', DeckSchema);
