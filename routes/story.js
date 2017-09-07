var express = require('express');
var router = express.Router();
var database = require('../custom_modules/database');
var mockData;

/* GET home page. */
router.get('/viewstory', function(req, res, next) {

  var authenticated = req.isAuthenticated();
    
  if(authenticated){
    var id = req.query.id;
    if(id == undefined){
        database.getStories(database.STORYSTATUS.APPROVED_ONLY, function(err, results){
          if(err){
            console.log('Error trying to get stories from database');
          } else {
            console.log('Stories retrieved successfully');
            res.render('viewstorylist', {
              data: results,
              authenticated: authenticated,
            });
          }
      });
    } else {
        database.getStory(id, function(err, results){
          var result = results[0];
          if(err){
            console.log('Error trying to get specific story from database.');
          } else {
            console.log('Success in retrieving story from database');
            
            res.render('viewstoryV2', {
              authorid: result.id,
              author: result.nickname,
              authenticated: authenticated,
              story_content: result.content,
              story_title: result.title
            });
          }
        });
    }
  } else 
    res.render('authenticationError');
});

/* GET home page. */
router.post('/viewstory', function(req, res, next) {

  var authenticated = true;
    
  if(authenticated){
    var id = req.body.id;

        database.getStory(id, function(err, results){
          var result = results[0];
          if(err){
            console.log('Error trying to get specific story from database.');
          } else {
            console.log('Success in retrieving story from database');
            res.json(results);
          }
        });
  } else 
    res.render('authenticationError');
});


router.post('/writestory', function(req, res, next) {
    database.insertStory(req.user.id, req.user.nickname, req.body.title, req.body.content, req.body.textContent);
    res.sendStatus(200);
});

router.get('/writestory', function(req, res, next) {
  var authenticated = req.isAuthenticated();
  if(authenticated)
    res.render('writestory', {authenticated: authenticated});
  else 
    res.render('authenticationError');
});

router.get('/bookstory', function(req, res, next) {

  var authenticated = req.isAuthenticated();
    
  if(authenticated){
    var id = req.query.id;
    if(id == undefined){
        database.getStories(database.STORYSTATUS.APPROVED_ONLY, function(err, results){
          if(err){
            console.log('Error trying to get stories from database');
          } else {
            console.log('Stories retrieved successfully');
            res.render('viewstorylistbookstyle', {
              data: results,
              authenticated: authenticated,
            });
          }
      });
    } else {
        database.getStory(id, function(err, results){
          var result = results[0];
          if(err){
            console.log('Error trying to get specific story from database.');
          } else {
            console.log('Success in retrieving story from database');
            
            res.render('viewstoryV2', {
              author: result.nickname,
              authenticated: authenticated,
              story_content: result.content,
              story_title: result.title,
              summary: result.summary
            });
          }
        });
    }
  } else 
    res.render('authenticationError');
});


router.get('/journal', function(req, res, next) {
  var authenticated = req.isAuthenticated();
  if(authenticated)
    res.render('journal', {authenticated: authenticated});
  else 
    res.render('authenticationError');
});

/* GET home page. */
router.get('/viewstory', function(req, res, next) {

  var authenticated = true;
  //var authenticated = req.isAuthenticated();
    
  if(authenticated){
    var id = req.query.id;
    if(id == undefined){
        database.getStoriesOfUser(database.STORYSTATUS.APPROVED_ONLY, function(err, results){
          if(err){
            console.log('Error trying to get stories from database');
          } else {
            console.log('Stories retrieved successfully');
            res.render('viewstorylist', {
              data: results,
              authenticated: authenticated
            });
          }
      });
    } else {
        database.getStory(id, function(err, results){
          var result = results[0];
          if(err){
            console.log('Error trying to get specific story from database.');
          } else {
            console.log('Success in retrieving story from database');
            
            res.render('viewstoryV2', {
              authorid: result.id,
              author: result.nickname,
              authenticated: authenticated,
              story_content: result.content,
              story_title: result.title
            });
          }
        });
    }
  } else 
    res.render('authenticationError');
});

router.post('/writejournal', function(req, res, next) {
    database.insertJournal(req.user.id, req.user.nickname, req.body.title, req.body.content, req.body.textContent);
    res.sendStatus(200);
});

module.exports = router;
