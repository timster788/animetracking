const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');

const Anime = require('../models/anime');

// FIND ALL
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    return Anime.find();
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// TEST IF THE CURRENT SUBMISSION IS OLDER THAN THE LATEST
// mongoose.connect(TEST_DATABASE_URL)
//   .then(() => {
//     return Purchase.find();
//   })
//   .then(results => {
//     const times = results.map(result => result.createdAt);
//     console.log(times);
//     console.log(times[times.length-1]);
//     let isAfter = false;
//     console.log('current time: ', moment());
//     if (moment().isAfter(times[times.length-1])) {
//       isAfter = true;
//     }
//     console.log(isAfter);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// TEST IF THE CURRENT MILES IS OLDER THAN THE LATEST MILES
// mongoose
//   .connect(TEST_DATABASE_URL)
//   .then(() => {
//     return Purchase.find();
//   })
//   .then(results => {
//     const currentMiles = 60000;
//     const miles = results.map(result => result.miles);
//     let isAfter = false;
//     if (currentMiles > miles[miles.length - 1]) {
//       isAfter = true;
//     }
//     console.log(miles[miles.length - 1]);
//     console.log(isAfter);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });
