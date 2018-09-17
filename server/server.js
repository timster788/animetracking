const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config');

const localStrategy = require('./passport/localStrategy');
const jwtStrategy = require('./passport/jwt');

const userRouter = require('./routes/users');
const animeRouter = require('./routes/animes');
const authRouter = require('./routes/auth');

const { dbConnect } = require('./db-mongoose');

passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', {
  session: false,
  failWithError: true
});
const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(cors());

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/animes', jwtAuth, animeRouter);
app.use('/api', authRouter);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// function runServer(port = PORT) {
//   const server = app
//     .listen(port, () => {
//       console.info(`App listening on port ${server.address().port}`);
//     })
//     .on('error', err => {
//       console.error('Express failed to start');
//       console.error(err);
//     });
// }

// if (require.main === module) {
//   dbConnect();
//   runServer();
// }

// Listen for incoming connections
if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose
    .connect(DATABASE_URL)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(
        `Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`
      );
    })
    .catch(err => {
      console.error(err);
    })
    .then(() => {
      app
        .listen(PORT, function() {
          console.info(`Server listening on ${this.address().port}`);
        })
        .on('error', err => {
          console.error(err);
        });
    });
}

module.exports = { app };
