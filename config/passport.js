//Authentication
//here we use passport for login authentication  --- refer to passport documentation website
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');//to compare the plain text password with the hash
const jwt = require('jsonwebtoken');
const config = require('./keys');

//load User model
const User = require('../models/User');

//export module, here passport is not declared above but passed as a parameter in the function below
module.exports = function(passport) {
    passport.use(
        //email is the username field for this app
        new LocalStrategy ({ usernameField: 'email' }, (email, password, done) => {
            //match user,
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'Email not registered' });
                    }
                    //match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        
                        if(isMatch) {
                           
                           return done(null, user);//null reps the err
                        }else{
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    //serialize and deserialize user //setting idd as cookie in browser
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //getting id from cookie and then use it to find user in database
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        });
    });

}