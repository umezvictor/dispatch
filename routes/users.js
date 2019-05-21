const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');//for password encryption
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const nodemailer = require ('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
//User model
const User = require('../models/User');
const async = require('async');
const crypto = require('crypto');//for generating random numbers, comes with node modules by default

//this users.js route handles all routes that begin with /users

//login page
router.get('/login', (req, res) => res.render('login'));

//make reference to passport documentation
//login handler   --- passport.authenticate('local')  means usse local strategy
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
      successRedirect: '/userWelcome',
      failureRedirect: '/users/login',
      failureFlash: true
  })(req, res, next);
});

//register page
router.get('/register', (req, res) => res.render('register'));

//register handler
router.post('/register', (req, res) => {
    //retrieve data with destruction
    const { name, email, password, password2 } = req.body;

    //validation
    let errors = [];
//if fields are empty
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'All fields are required' });//push into the empty errors array
    }

    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(password !== password2){
        errors.push({ msg: 'Passwords do not match' });
    }

    //if errors exist, render register page with previously entered records
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
                    //if user exists, re render the page with the values previously inputed
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
                    //10 is the number of rounnpds to use if ommitted
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




//logout handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


//page to enter email and request for password reset link via email
router.get('/reset-password', (req, res) =>  res.render('reset-user-password'));


//send password reset link to the user's email
router.post('/reset-password', (req, res) => {
    
    const transporter = nodemailer.createTransport(sendgridTransport({
        auth: {
            api_key: config.SendGridKey1
        }
    }));
//async.waterfall is an array of functions that pass values down to each other
    async.waterfall([
        function(done) {
          User.findOne({
            email: req.body.email
          }).exec(function(err, user) {
            if (user) {
              done(err, user);
            } else {
              req.flash('error_msg', 'email not found, enter your registered email' );
              return res.redirect('/users/reset-password')
              //done('User not found.');
            }
          });
        },//user is passed to next function, that's async.waterfall for you
        function(user, done) {
          // create the random token
          crypto.randomBytes(20, function(err, buffer) {
            var token = buffer.toString('hex');
            done(err, user, token);
          });
        },//user and token is passed on
        function(user, token, done) {
          /*
          find user by id and update the resetPasswordToken field with the newly 
          created token, resetPasswordExpires with current date
         */
          User.findByIdAndUpdate({ _id: user._id }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
            done(err, token, new_user);
          });
        },
        function(token, user, done) {
          var data = {
            to: user.email,
            from: 'victorblaze2010@gmail.com',
           // template: 'forgot-password-email',
            subject: 'Reset your password',
            html: `<p>http://localhost:3050/users/reset-my-password/${token}</p>`
            
          };
    
          transporter.sendMail(data, function(err) {
            if (!err) {
              req.flash( 'success_msg', 'a password reset link has been sent to your email');
              return res.redirect('/users/reset-password');
            } else {
              return done(err);
              

            }
          });
        }
      ], function(err) {
        return res.status(422).json({ message: err });
      });

});

//displays page to enter new password
router.get('/reset-my-password/:token', function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if(!user){
      return res.redirect('/reset-password');
    }
    //console.log(user);
    //render page to enter new password, and pass the user object to it
    res.render('reset-user-password-with-token', {
      user: user
    });
   // console.log(user);
  });
});



//save new password to db after verifying token
router.post('/reset-my-password/:token', function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token }, function(err, user){
    if(!user){
      console.log('user not found');
      req.flash( 'error_msg', 'User not found' );
      res.render('/reset-user-password-with-token');
    }

    //hash new password
    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
      //save password to db
      user.password = hash;
      user.resetPasswordToken = undefined;//remove from collection for security purpose
      user.resetPasswordExpires = undefined; 
      user.save(function(){
        console.log('password changed');
        req.login(user, function(err) {
          if (err) { return next(err); }
          req.flash('success_msg', 'Your password has been reset');
        return res.redirect('/users/login');//redirect to login page
          //When the login operation completes, user will be assigned to req.user
        });
      });
    }));
  });
});

module.exports = router;