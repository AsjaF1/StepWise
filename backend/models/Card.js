const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema(
  { chunk: String, meaning: String },
  { _id: false }
);

const MnemonicItemSchema = new mongoose.Schema(
  { letter: String, word: String, rest: String, color: String, emoji: String },
  { _id: false }
);

const CardSchema = new mongoose.Schema({
  deckId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true, index: true },
  userId:        { type: String, required: true },
  type:          { type: String, enum: ['word', 'mnemonic'], default: 'word' },
  term:          { type: String, required: true, trim: true },
  definition:    { type: String, default: '' },
  example:       { type: String, default: '' },
  phonetic:      { type: String, default: '' },
  emojis:        [String],
  parts:         [PartSchema],
  mnemonicItems: [MnemonicItemSchema],
  position:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
