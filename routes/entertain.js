var express = require('express');
var router = express.Router();


router.get('/entertain', function(req, res, next) {
  var authenticated = req.isAuthenticated();
  if(authenticated){
    res.render('entertainmentSelect', {authenticated:authenticated});
  } else {
    res.render('authenticationError');
  }
});

router.get('/entertain/bookstore', function(req, res, next) {
  var authenticated = req.isAuthenticated();
  if(authenticated){
    res.render('bookStore', {authenticated: authenticated});
  } else {
    res.render('authenticationError');
  }
});

router.get('/entertain/game', function(req, res, next) {
  var authenticated = req.isAuthenticated();
  if(authenticated){
    res.render('game', {authenticated: authenticated});
  } else {
    res.render('authenticationError');
  }
});


module.exports = router;
