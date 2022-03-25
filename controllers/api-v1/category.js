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

// POST /users/register -- CREATE a new user
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

      const cardsInput = req.body.cards;

      //   console.log("this is console for: ",cardsInput)

      //    const cardSpot = categoryCheck.decks.cards

      const deckName = req.body.deckName;
      let deck = categoryCheck.decks.indexOf(deckName);

      cardsInput.forEach((element) => {
        console.log(element);
        console.log(categoryCheck.decks);
        categoryCheck.decks[deck].cards.push(element);
      });

      //    for(let i = 0; i < cardsInput.length;i++){

      //    }

      await newCategory.save();
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

      //   cardsInput.forEach((elememt,index)=>{

      //   })

      //   console.log(newCategory.decks[0].cards[0])

      await newCategory.save();
      res.json({ newCategory });
    }

    //   {
    //     name:categoryName,
    //     decks: {
    //         name: deckName,
    //         cards: []
    //     }
    // }

    //   const newCards = await db.Category.newCategory.newDeck.cards.create({
    //     question: re

    //   })
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
