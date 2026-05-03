const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
  userId:  { type: String, required: true, index: true },
  name:    { type: String, required: true, trim: true },
  deckIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deck' }],
}, { timestamps: true });

module.exports = mongoose.model('Folder', FolderSchema);
