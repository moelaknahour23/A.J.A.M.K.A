var express = require('express');
var router = express.Router();
var database = require('../custom_modules/database');

var REQUEST_TYPE = {
	POST_COMMENT: 'post',
	GET_COMMENTS: 'get-comments'
}

/* GET users listing. */
router.get('/comments', function(req, res, next) {
  console.log('TODO');
});

router.post('/commentsapi', function(req, res, next) {
	var reqType = req.body.reqType;
	
	switch(reqType){
		case REQUEST_TYPE.POST_COMMENT:
			database.insertComment(req.body.id, req.body.msg, 17, function(err){
	  		if(err){
					console.log('Error!!');
					res.sendStatus(500);
				}
	  		else
		  		res.sendStatus(200);
  			});
				break;
			
			case REQUEST_TYPE.GET_COMMENTS:
				database.getComments(req.body.id, function(err, results){
					if(err){
						console.log('Error!');
						res.sendStatus(500);
					} else {
						res.json(results);
					}
				});
				break;
		}
});

router.get('/userslist', function(req, res, next) {
  database.getUsers(function(err, results){
	  if(err){
		  console.log('Error!!');
		  res.sendStatus(500);
		}
	  else{
		  console.log(results);
		  res.sendStatus(200);
	  }
  });
});
module.exports = router;
