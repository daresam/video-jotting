const express = require('express');
const router =  express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


// Users Login Form
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Login
router.post('/login', (req, res, next) => {
    
    passport.authenticate('local', {
        successRedirect:'/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    
}); 

// User Registration Form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// User Registration 
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = [];

    if(password !== confirmPassword) {
        errors.push({
            text: 'Passwords do not match'
        })
    }
    if (password.length < 4) {
        errors.push({
            text: 'Passwords must be atleast 4 characters'
        })
    }
    if (!name) {
        errors.push({
            text: 'Name field is required'
        })
    }
    if (!email) {
        errors.push({
            text: 'Email field is required'
        })
    }
    if(errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: name,
            email: email
        });
    } else {
        User.findOne({email: email}) .then((user) => {
            if(user) {
                // req.flash('error_msg', 'Email already exist');
                errors.push({text: 'Email already exist'});
                res.render('users/register', {
                    errors: errors,
                    name: name,
                    email: email
                });
            } else {
                const newUser = {
                    name: name,
                    email: email,
                    password: password
                };
                
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        const user = new User(newUser);
                        user.save().then((user) => {
                             req.flash('success_msg', 'Your registration was successful');
                             res.redirect('/users/login');
                        }).catch((err) => {
                            console.log(err)
                        });
                    })
                });
            }
        }).catch((err) => {
            console.log(err);
        });
      
    }
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'logout successfully');
    res.redirect('/users/login');
});
module.exports = router;