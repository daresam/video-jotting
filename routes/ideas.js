const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const {ensureAuthenticated} = require('../helpers/auth');



// Ideas
router.get('', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            })
        })
});
// Add Ideas Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Add Ideas
router.post('', ensureAuthenticated, (req, res) => {
    console.log(req.user)
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
            details: details,
            user: req.user.id
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
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const id = {_id: req.params.id};
    Idea.findOne(id).then(idea => {
        if(idea.user !== req.user.id){
            req.flash('error_msg', 'Not Authorize');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea: idea
            });
        }
    });
   
});

// Update Ideas
router.put('/update/:id', ensureAuthenticated, (req, res) => {
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

router.delete('/destroy/:id', ensureAuthenticated, (req, res) => {
    const id = {_id: req.params.id};

    Idea.remove(id).then(idea => {
        req.flash('success_msg', 'Video Idea Removed Successfully');
        res.redirect('/ideas');
    })
});

module.exports = router;
