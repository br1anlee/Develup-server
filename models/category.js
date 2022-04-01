const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
    minLength: 2
  },
  answer: {
    type: String,
    required: true,
    minLength: 3
  },
});

const deckSchema = mongoose.Schema({
  deckName: {
    type: String,
    minLength: 2,
    required: true,
  },
  author: String,
  cards: [cardSchema],
});

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    required: true,
  },
  decks: [deckSchema],
});

module.exports = mongoose.model('Category', categorySchema);