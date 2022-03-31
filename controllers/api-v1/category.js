const express = require('express');
const router = express.Router();
const db = require('../../models');

// GET - View all categories
router.get('/', async (req, res) => {
  const allCategories = await db.Category.find({});

  res.json(allCategories);
});

// GET - view a single category
router.get('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const oneDeck = await db.Category.findById({_id: categoryId})
    res.status(202).json(oneDeck)
  } catch (err) {
    console.log(err)
    res.status(503).json({msg: "Something isn't right."})
  }
})

//GET - View a single deck
router.get('/:categoryId/deck/:deckId', async (req, res) => {
  const deckId = req.params.deckId;
  const categoryId = req.params.categoryId;

  const category = await db.Category.findById({
    _id: categoryId,
  });
    oneDeck = category.decks.id(deckId)
    res.json(oneDeck)
  });


// POST - create a new deck and cards (may include category)
router.post('/', async (req, res) => {
  try {
    // Check if a category exists
    const categoryCheck = await db.Category.findOne({
      name: req.body.name,
    });

    // If a category exists, create a new deck and new cards
    if (categoryCheck) {
      const deckNameCheck = categoryCheck.decks.find((elem) => {
        return elem.deckName === req.body.deckName;
      });

      console.log(deckNameCheck)

      if (deckNameCheck) {
        res
          .status(409)
          .json({
            msg: 'That deck name is already in use, please choose another',
          });
      } else {
        categoryCheck.decks.push({
          deckName: req.body.deckName,
          author: req.body.author,
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
      }

      // if a category doesn't exist, create a new category, new deck and new cards
    } else {
      const newCategory = await db.Category.create({
        name: req.body.name,
        decks: [],
      });

      newCategory.decks.push({
        deckName: req.body.deckName,
        author: req.body.author,
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

// DELETE - Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await db.Category.findByIdAndDelete({
      _id: req.params.id,
    });
    const allCategories = await db.Category.find({});
    res.json(allCategories);
  } catch (err) {
    console.log(err);
  }
});

//DELETE - Delete a deck
router.delete('/:categoryId/deck/:deckId', async (req, res) => {
  const deckId = req.params.deckId;
  const categoryId = req.params.categoryId;

  const category = await db.Category.findById({
    _id: categoryId,
  });
  const allCategories = await db.Category.find({});
  try {
    category.decks.id(deckId).remove();
    await category.save();

    console.log(category);

    if (category.decks.length === 0) {
      category.remove();
      // await category.save();
      res.json(allCategories);
      return;
    }

    res.json({ category });
  } catch (err) {
    console.log(err);
  }
});

//PUT - update a deck and cards
router.put('/:categoryId/deck/:deckId', async (req, res) => {
  const deckId = req.params.deckId;
  const categoryId = req.params.categoryId;

  const category = await db.Category.findById({
    _id: categoryId,
  });

  let deckIdx = category.decks.findIndex((object) => {
    return object.id === deckId;
  });

  try {
    if (req.body.deckName) {
      category.decks[deckIdx].deckName = req.body.deckName;
    }

    if (req.body.cards) {
      category.decks[deckIdx].cards = req.body.cards;
    }
    
    await category.save();

    res.json({ category });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
