const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');//for password encryption
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
//User model
const User = require('../models/User');


//this users.js route handles all routes that begin with /users

//login page
router.get('/login', (req, res) => res.render('login'));

//register page
router.get('/register', (req, res) => res.render('register'));

//register handler
router.post('/register', (req, res) => {
    //retrieve data with destruction
    const { name, email, password, password2 } = req.body;

    //validation
    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({ msg: 'All fields are required' });
    }

    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(password !== password2){
        errors.push({ msg: 'Passwords do not match' });
    }

    //if errors exist
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //check if User exists in database, verify with email
        User.findOne({ email: email })   //matching email from database with email inputed by user (email variable above)
            .then(user => {
                if(user) {
                    //user exists
                    errors.push({ msg: 'Email already exists' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }else{
                    //create new user
                    const newUser = new User({
                        //name, same as name:name  --- writing one name only is es6 syntax
                        name,
                        email,
                        password
                    });

                    //hash password with bcryptjs
                    //10 is the number of rounds to use if ommitted
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        //set password to hashed
                        newUser.password = hash;

                        //save user
                        newUser.save()
                            .then(user => {
                                //display flash message
                                req.flash('success_msg', 'Registration successful, proceed to login');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }))
                }//end of if else
            });
    }
});


//login handler   --- passport.authenticate('local')  means usse local strategy
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/userWelcome',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});



 


// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         try {
//             if(err || !user){
//                 res.redirect('/users/login');
//             }
//            //success
//             const payload = { _id: user._id, name: user.name }; //don't add password or sensitive info to payload
//             //sign a token
//             //success doesn't login you in immediately, it only issues a token to the user
//             jwt.sign(payload, config.JWT_SECRET, { expiresIn: 120 }, (err, token) => {
                
//                 // res.json({
//                 //     success: true,
//                 //     token: 'Bearer ' + token
//                 // });
//                 //const myToken = 'Bearer ' + token;
//                 res.set('Authorization', 'Bearer ' + token);
//                 res.redirect('/userWelcome');
                
//                 //res.redirect('/userWelcome/?token= '+token);
//                 //res.redirect('/userWelcome/?token=' + 'Bearer ' + token);
//             });
            
//         } catch (err) {
//             return next(err);
//         }
//     })(req, res, next);
// });


// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         try {
//             if(err || !user){
//                 res.redirect('/users/login');
//             }
//             req.login(user, {session: false}, async (err) => {
//                 if(err) return next(err)
//                 const body = { _id: user._id, email: user.email };
//                 const token = await jwt.sign({user: body}, config.JWT_SECRET);
//                 return res.json({ token });
//                 //res.redirect('/userWelcome');
//             });
//         } catch (err) {
//             return next(err);
//         }
//     })(req, res, next);
// });


//logout handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router;