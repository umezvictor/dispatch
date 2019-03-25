//here passport-jwt is used to extract and validate the user token and login
//this will be required to access protected routes

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
//const User = mongoose.model('User');//User model
const config = require('../config/keys');
const User = require('../models/User');

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;

module.exports = passport => {
    passport.use(new JWTstrategy(opts, (jwt_payload, done) => {
        //payload contains user info contained when assigning tokeen
        //console.log(jwt_payload);
        //find user whose id is contained in the token verified
        User.findById(jwt_payload._id)
            .then(user => {
                if(user){
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};