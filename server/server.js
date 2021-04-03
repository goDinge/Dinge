const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const errorHandler = require('./middleware/error');

//.env setup
dotenv.config({ path: '.env' });

//db setup
connectDB();

//express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
const auth = require('./routes/auth');
const users = require('./routes/users');
const dinge = require('./routes/dinge');
const ding = require('./routes/ding');

//Routes setup
app.get('/', (req, res) => {
  console.log('Route connected');
  res.send('Route connected');
});

//Mount routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/dinge', dinge);
app.use('/api/ding', ding);

app.use(errorHandler);

//PORT
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handle unhandled Promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
