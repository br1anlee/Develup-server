const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../models');
const requiresToken = require('../requiresToken');
const user = require('../../models/user');

// GET - View all categories
router.get('/', async (req, res) => {
  const allCategories = await db.Category.find({});

  res.json(allCategories);
});

// POST - create a new category
router.post('/', async (req, res) => {
  try {
    // Check if a category exists
    const categoryCheck = await db.Category.findOne({
      name: req.body.name,
    });

    // If a category exists, create a new deck and new cards
    if (categoryCheck) {
      categoryCheck.decks.push({
        deckName: req.body.deckName,
        cards: [],
      });

      await categoryCheck.save();

      const cardsInput = req.body.cards;

      let deckIdx = categoryCheck.decks.findIndex((object) => {
        return object.deckName === req.body.deckName;
      });

      cardsInput.forEach((element) => {
        categoryCheck.decks[deckIdx].cards.push(element);
      });

      await categoryCheck.save();
      res.json({ categoryCheck });

    // if a category doesn't exist, create a new category, new deck and new cards
    } else {
      const newCategory = await db.Category.create({
        name: req.body.name,
        decks: [],
      });

      newCategory.decks.push({
        deckName: req.body.deckName,
        cards: [],
      });

      await newCategory.save();

      const cardsInput = req.body.cards;

      let deckIdx = newCategory.decks.findIndex((object) => {
        return object.deckName === req.body.deckName;
      });

      cardsInput.forEach((element) => {
        newCategory.decks[deckIdx].cards.push(element);
      });

      await newCategory.save();
      res.json({ newCategory });
    }
  // Log an error to the server's console if there is an issue creating anything
  } catch (err) {
    console.log(err);
    res.status(503).json({ msg: 'server error 503 🔥😭' });
  }
});

// Delete a deck
router.delete('/:id', async (req, res) => {


  



  const deletedCategory = await db.Category.findByIdAndDelete({
    _id: req.params.id,
  });

  const allCategories = await db.Category.find({});

  res.json(allCategories);
});

module.exports = router;
