const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverRide = require('method-override');

const Idea = require('./models/Idea');

// Express
let app = express();

// Promise
Promise.mongoose = global.Promise;

//Mongoose DB
mongoose.connect('mongodb://localhost:27017/videojotting')
        .then(() => console.log('Connected'))
        .catch((err) => console.log(err))


// Bod Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Method Override Middleware
app.use(methodOverRide('_method'));
const port = process.env.PORT || 3000;

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

// Ideas
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            })
        })
});
// Add Ideas Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Add Ideas
app.post('/ideas', (req, res) => {
    let errors = [];
    const title = req.body.title;
    const details = req.body.details;

    if(!title) {
        errors.push({text: 'Please add a title'});
    }
    if(!details) {
        errors.push({text: 'Please add some details'});
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: title,
            details: details
        });
    } else {
        const newUser = {
            title: title,
            details: details
        };

        const idea = new Idea(newUser);
        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            }).catch(err => console.log(`Error: ${err}`))
    }
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
    const id = {_id: req.params.id};
    Idea.findOne(id).then(idea => {
        res.render('ideas/edit', {
            idea: idea
        })
    });
   
});

// Update Ideas
app.put('/ideas/update/:id', (req, res) => {
    let errors = [];
    const title = req.body.title;
    const details = req.body.details;

    if(!title) {
        errors.push({text: 'Please add a title'});
    }
    if(!details) {
        errors.push({text: 'Please add some details'});
    }
    if (errors.length > 0) {
        res.render('ideas/edit', {
            errors: errors,
            idea: {title: title, details: details}
        });
    } else {
        const id = {_id: req.params.id};
        Idea.findOne(id)
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save().then(idea => {
                res.redirect('/ideas');
            });
        });
    }
});

app.delete('/ideas/destroy/:id', (req, res) => {
    const id = {_id: req.params.id};

    Idea.remove(id).then(idea => {
        res.redirect('/ideas');
    })
})

//Listening to Port
app.listen(port, () => console.log(`Listening on Port: ${port}`));
