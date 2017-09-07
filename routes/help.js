var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/aboutus', function(req, res, next) {
  res.render('help_pages/AboutUS', {authenticated: req.isAuthenticated()});
});

router.get('/help', function(req, res, next) {
  res.render('help_pages/Help', {authenticated: req.isAuthenticated()});
});

router.get('/gettingstarted', function(req, res, next) {
  res.render('help_pages/GettingStarted', {authenticated: req.isAuthenticated()});
});

router.get('/helptopic', function(req, res, next) {
  res.render('help_pages/HelpTopic', {authenticated: req.isAuthenticated()});
});


module.exports = router;
