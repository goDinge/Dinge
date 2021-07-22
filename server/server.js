const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const errorHandler = require('./middleware/error');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

//.env setup
dotenv.config({ path: '.env' });

//db setup
connectDB();

//express setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
  next();
});

//Routes
const auth = require('./routes/auth');
const users = require('./routes/users');
const dinge = require('./routes/dinge');
const ding = require('./routes/ding');
const comments = require('./routes/comments');
const eventComments = require('./routes/eventComments');
const events = require('./routes/events');
const event = require('./routes/event');
const admin = require('./routes/admin');

//Routes setup
app.get('/', (req, res) => {
  console.log('Route connected');
  res.send('Route connected');
});

//set security headers
app.use(helmet());

//prevent cross site attacks
app.use(xss());

//rate limit
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//Mount routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/dinge', dinge);
app.use('/api/ding', ding);
app.use('/api/comments', comments);
app.use('/api/eventcomments', eventComments);
app.use('/api/events', events);
app.use('/api/event', event);
app.use('/api/admin', admin);

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
