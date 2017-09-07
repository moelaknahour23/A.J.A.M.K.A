var configAuth = require('./auth');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var database = require('../custom_modules/database.js');

module.exports = function(passport){

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

    passport.use(new GoogleStrategy({
        clientID : configAuth.googleAuth.clientID,
        clientSecret : configAuth.googleAuth.clientSecret,
        callbackURL : configAuth.googleAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done){
        database.findOrCreateUser(profile.emails[0].value, function(err, user){
            return done(err, user);
        }); 
    }));
}