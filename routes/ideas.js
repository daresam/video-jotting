const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');


// Ideas
router.get('', (req, res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            })
        })
});
// Add Ideas Form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

// Add Ideas
router.post('', (req, res) => {
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
                req.flash('success_msg', 'Video Idea Created Successfully');
                res.redirect('/ideas');
            }).catch(err => console.log(`Error: ${err}`))
    }
});

// Edit Idea Form
router.get('/edit/:id', (req, res) => {
    const id = {_id: req.params.id};
    Idea.findOne(id).then(idea => {
        res.render('ideas/edit', {
            idea: idea
        })
    });
   
});

// Update Ideas
router.put('/update/:id', (req, res) => {
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
                req.flash('success_msg', 'Video Idea Updated Successfully');
                res.redirect('/ideas');
            });
        });
    }
});

router.delete('/destroy/:id', (req, res) => {
    const id = {_id: req.params.id};

    Idea.remove(id).then(idea => {
        req.flash('success_msg', 'Video Idea Removed Successfully');
        res.redirect('/ideas');
    })
});

module.exports = router;
