var express = require('express');
var router = express.Router();
var database = require('../custom_modules/database');

var REQUEST_TYPE = {
	UPDATE_USER: 'update',
	GET_USER: 'get-one',
	GET_CURRENT_USER: 'get-current',
	GET_ALL_USERS: 'get-all',
	GET_MENTOR: 'get-mentor',
	FIRST: 'first-time'
}

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('Failed to log in');
});

router.get('/usersapi', function(req, res, next){
	var reqType = req.body.reqType;

	switch(reqType){	
			case REQUEST_TYPE.GET_USER:
				database.getUser(req.body.id, function(err, results){
					if(err){
						console.log('Error!');
						res.sendStatus(500);
					} else {
						res.json(results[0]);
					}
				});
				break;

				case REQUEST_TYPE.GET_CURRENT_USER:
					var authenticated = req.isAuthenticated();
					if(authenticated){
						res.json(req.user);
					} else {
						res.sendStatus(401);
					}
				break;

				case REQUEST_TYPE.GET_ALL_USERS:
				database.getUsers(function(err, results){
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

router.post('/usersapi', function(req, res, next) {
	var reqType = req.body.reqType;
	
	switch(reqType){
		case REQUEST_TYPE.UPDATE_USER:
			database.updateUser(req.body.id, req.body.key, req.body.value, function(err){
	  		if(err){
					console.log('Error!!');
					res.sendStatus(500);
				}
	  		else
					console.log('User successfully updated');
		  		res.sendStatus(200);
  			});
				break;
			
			case REQUEST_TYPE.GET_USER:
				database.getUser(req.body.id, function(err, results){
					if(err){
						console.log('Error!');
						res.sendStatus(500);
					} else {
						res.json(results[0]);
					}
				});
				break;

				case REQUEST_TYPE.GET_CURRENT_USER:
					var authenticated = req.isAuthenticated();
					if(authenticated){
						res.json(req.user);
					} else {
						res.sendStatus(401);
					}
				break;

				case REQUEST_TYPE.GET_ALL_USERS:
				database.getUsers(function(err, results){
					if(err){
						console.log('Error!');
						res.sendStatus(500);
					} else {
						res.json(results);
					}
				});
				break;

				case REQUEST_TYPE.FIRST:
			database.updateFirstTimeUser(req.user.id, req.body.nickname, function(err){
	  		if(err){
					console.log('Error!!');
					res.sendStatus(500);
				}
	  		else
					console.log('User successfully updated');
		  			res.redirect('/index');
  			});
				break;
			
		}
});

router.post('/mentorsapi', function(req, res, next) {
	var reqType = req.body.reqType;
	
	switch(reqType){
		case REQUEST_TYPE.GET_MENTOR:
			database.getMentor(req.body.id, function(err, results){
	  		if(err){
					console.log('Error!!');
					res.sendStatus(500);
				}
	  		else
					res.json(results[0]);
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
		  res.json(results);
		}
  });
});

router.get('/welcome', function(req, res, next) {

	var authenticated = req.isAuthenticated();
	if(!authenticated){
		res.render('authenticationError');
	} else {
		if(req.user.firstTime == 0)
			res.render('index', {
		})
		else{
			var nickname = req.user.nickname;
			res.render('welcome', {
				nickname: nickname,
				authenticated: authenticated
			});
		}
	}
});
module.exports = router;
