var express = require('express');

module.exports = function(passport){
    var router = express.Router();

    router.get('/auth/google', 
        passport.authenticate('google', {scope : ['email']}));
    
    router.get('/auth/google/callback', 
        passport.authenticate('google', {
            failureRedirect: '/users'
        }), function(req, res){
            console.log(req.user.firstTime);
            if(req.user.firstTime == 1)
                res.redirect('/welcome');
            else
                res.redirect('/');
        });

    router.get('/auth/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.get('/loginprompt', function(req, res){
        res.render('authenticationError');
    });
    
    return router;
};