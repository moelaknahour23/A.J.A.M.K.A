var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var authenticated = req.isAuthenticated();


  res.render('index', { title: 'Self-Improvement' , authenticated: req.isAuthenticated()});
});

router.get('/index', function(req, res, next) {
  var authenticated = req.isAuthenticated();

  res.render('index', { title: 'Self-Improvement' , authenticated: req.isAuthenticated()});
});


module.exports = router;
