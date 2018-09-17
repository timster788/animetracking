

const mongoose = require('mongoose');

const { MONGODB_URL } = require('../config');

const User = require('../models/user');
const Anime = require('../models/anime');

const seedUser = require('../db/users');
const seedAnime = require('../db/animes');

console.log(`Connecting to mongodb at ${MONGODB_URL}`);
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      User.insertMany(seedUser),
      User.createIndexes(),
      Anime.insertMany(seedAnime),
      Anime.createIndexes()
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
