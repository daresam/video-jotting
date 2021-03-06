const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverRide = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const ideas = require('./routes/ideas');
const users = require('./routes/users');
const db = require('./config/database');


// Express
let app = express();

// Promise
Promise.mongoose = global.Promise;

//Mongoose DB
mongoose.connect(db.mongoURI)
        .then(() => console.log('Connected'))
        .catch((err) => console.log(err))


// Bod Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Port
const port = process.env.PORT || 3000;

// Method Override Middleware
app.use(methodOverRide('_method'));

// Expression Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//  Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// flash Middleware
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
//Handlebar Template Engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('home', {
        title: title
    });
});
// About Page
app.get('/about', (req, res) => {
    res.render('about')
});


// Users Routes
app.use('/users', users);
// Ideas Routes
app.use('/ideas', ideas);

// Passport Config
require('./config/passport')(passport);
//Listening to Port
app.listen(port, () => console.log(`Listening on Port: ${port}`));
