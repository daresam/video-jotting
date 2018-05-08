const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const Idea = require('./models/Idea');

// Express
let app = express();

// Promise
Promise.mongoose = global.Promise;

//Mongoose DB
mongoose.connect('mongodb://localhost:27017/videojotting')
        .then(() => console.log('Connected'))
        .catch((err) => console.log(err))

const port = process.env.PORT || 3000;

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

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



//Listening to Port
app.listen(port, () => console.log(`Listening on Port: ${port}`));
