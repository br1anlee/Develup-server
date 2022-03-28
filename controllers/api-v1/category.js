const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../models');
const requiresToken = require('../requiresToken');
const user = require('../../models/user');

// GET /

router.get('/', async (req, res) => {
  const allCategories = await db.Category.find({});

  res.json(allCategories);
});


router.post('/', async (req, res) => {
  try {
    // Check if a category exists
    const categoryCheck = await db.Category.findOne({
      name: req.body.name,
    });

    // If a category exists, create a deck in that category
    if (categoryCheck) {

      categoryCheck.decks.push({
        deckName: req.body.deckName,
        cards: [],
      });

      await categoryCheck.save();

      const cardsInput = req.body.cards;

    //   let deckIdx = categoryCheck.decks.indexOf(req.body.deckName);
    let deckIdx = categoryCheck.decks.findIndex((object) => {
        return object.deckName === req.body.deckName;
      });


      cardsInput.forEach((element) => {
        categoryCheck.decks[deckIdx].cards.push(element);
      });
      
        await categoryCheck.save();
        res.json({ categoryCheck });

      // if a category doesn't exist
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

      console.log(newCategory);


      await newCategory.save();
      res.json({ newCategory });
    }

  } catch (err) {
    console.log(err);
    res.status(503).json({ msg: 'oops server error 503 🔥😭' });
  }
});

router.delete('/:id', async (req, res) => {
  const deletedCategory = await db.Category.findByIdAndDelete({
    _id: req.params.id,
  });

  const allCategories = await db.Category.find({});

  res.json(allCategories);
});

module.exports = router;
