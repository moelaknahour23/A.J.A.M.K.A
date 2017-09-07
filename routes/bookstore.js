var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('entertain/bookstore', function(req, res, next) {
  res.render('bookStore', {authenticated: req.isAuthenticated()});
});

module.exports = router;
