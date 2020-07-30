const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User');
const secretOrKey = require('./keys').secretOrKey;

// Options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (payload,done) => {
        User.findById(payload.id)
        .then((user)=>{
            if(user){
                return done(null,user);
            }else{
                return done(null,false); 
            }
        })
        .catch(err => console.log(err));
    }));
}