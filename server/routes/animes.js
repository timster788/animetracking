const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Anime = require('../models/anime');

const router = express.Router();

// Protect endpoints using JWT Strategy
router.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const userId = req.user.id;

  let filter = { userId };
  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.$or = [
      { title: re },
      { series_type: re },
      { url: re },
      { rating: re }
    ];
  }
  Anime.find(filter)

    .sort({ updatedAt: 'desc' })
    .then(results => {
      console.log(results);
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Anime.findOne({ _id: id, userId })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, series_type, url, rating } = req.body;
  const userId = req.user.id;
  const newAnime = { title, series_type, url, rating, userId };

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  //   Promise.all([
  //     validateFolderId(folderId, userId),
  //     validateTagIds(tags, userId)
  //   ])
  //     .then(() => Note.create(newNote))
  //     .then(result => {
  //       res
  //         .location(`${req.originalUrl}/${result.id}`)
  //         .status(201)
  //         .json(result);
  //     })
  //     .catch(err => {
  //       next(err);
  //     });
  Anime.create(newAnime)
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, series_type, url, rating } = req.body;
  const userId = req.user.id;
  const updateAnime = { title, series_type, url, rating, userId };

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (title === '') {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  Anime.findByIdAndUpdate(id, updateAnime, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Anime.findOneAndRemove({ _id: id, userId })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
