require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session");
const flash = require("connect-flash");

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// make our app create sessions (more on this later)
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "eXUW6iJ6=2h}yBC36P^;MmJ+fpYiU8A[Mg2KNRAj?C"
  })
);

// enable flash messages in our routes with
app.use(flash());
// this function runs before all your routes
app.use((req, res, next) => {
  // send flash messages to the hbs file as messages
  res.locals.messages = req.flash();
  // you need this or your app won't work (pages will load forever)
  next();
});

// default value for title local
app.locals.title = 'Express - Basic Auth';



const index = require('./routes/index');
app.use('/', index);

const authRouter = require("./routes/auth-router.js");
app.use("/", authRouter);

module.exports = app;
