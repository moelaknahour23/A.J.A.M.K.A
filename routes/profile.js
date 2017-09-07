var express = require('express');
var router = express.Router();
var database = require('../custom_modules/database');
var fs = require('fs');
var mockData;

router.get('/myProfile', function(req, res, next){

  var authenticated = req.isAuthenticated();

  if(!authenticated){
    res.sendStatus(401);
    return false;
  } 

  var id = req.user.id;
  var allowEdit = false;
  var stories = [];
  var journals = [];
  var todojson = '';

  if(id){
    if(authenticated && id == req.user.id)
      allowEdit = true;
    database.getStoriesOfUser(id, function(err, results){
      if(err)
        res.sendStatus(500);
      else{
        stories = results;
        getJournals(id, function(){
          getUser(id);
        });
      }
    });

    
  } else {
    console.log('No id given for profile');
    res.render('profile3', {layout: false});
    //res.sendStatus(400);
  }

  function getJournals(id, callback){
    console.log("Retireval of jounral");
    database.getJournalOfUser(id, function(err, results){
      journals = results;
      callback();
    })
  }

  function getTodoSet(authorid, callback){
      console.log("Retireval of todoset");
      database.getTodoSets(authorid, function(err, results){
        todojson = results[0];
        callback();
      })
  }

  function getUser(id){
    database.getUser(id, function(err, results){
      if(err)
        res.sendStatus(500);
      else {
        if(results.length <= 0)
          res.render('error',{
            message: "Profile URL invalid"
          });
        else {
          var userData = results[0];
          var profileImageLinks = [];
          if(allowEdit){
            fs.readdir('./public/images/profilepics/', (err, files) => {
              files.forEach(file => {
              profileImageLinks.push('/images/profilepics/' + file);
            });
          });
          }

          res.render('profile3', {
            layout: false,
            userData: userData,
            allowEdit: allowEdit,
            journals: journals,
            stories: stories,
            todolist: todojson,
            profileImageLinks: profileImageLinks,
            authenticated: authenticated
          });
        }
      }
    });
  }

});

router.get('/profile', function(req, res, next){
  var id = parseInt(req.query.id);
  var allowEdit = false;
  var stories = [];
  var journals = [];
  var authenticated = req.isAuthenticated();

  if(id){
    if(authenticated && id == req.user.id)
      allowEdit = true;
    database.getStoriesOfUser(id, function(err, results){
      if(err)
        res.sendStatus(500);
      else{
        stories = results;
        console.log("tick!!");
        getJournals(id, function(){
          getUser(id);
        });
      }
    });

    
  } else {
    console.log('No id given for profile');
    res.render('profile3', {layout: false});
    //res.sendStatus(400);
  }

  function getJournals(id, callback){
    console.log("Retireval of jounral");
    database.getJournalOfUser(id, function(err, results){
      journals = results;
      callback();
    })
  }

  function getUser(id){
    database.getUser(id, function(err, results){
      if(err)
        res.sendStatus(500);
      else {
        if(results.length <= 0)
          res.render('error',{
            message: "Profile URL invalid"
          });
        else {
          var userData = results[0];
          var profileImageLinks = [];
          if(allowEdit){
            fs.readdir('./public/images/profilepics/', (err, files) => {
              files.forEach(file => {
              profileImageLinks.push('/images/profilepics/' + file);
            });
          });
          }

          res.render('profile3', {
            layout: false,
            userData: userData,
            allowEdit: allowEdit,
            stories: stories,
            journals: journals,
            profileImageLinks: profileImageLinks,
            authenticated: authenticated
          });
        }
      }
    });
  }

});


/* GET home page. */
router.get('/profilelist', function(req, res, next) {
  var authenticated = req.isAuthenticated();
    
  if(authenticated){
        database.getUsers(function(err, results){
          if(err){
            console.log('Error trying to get users from database');
          } else {
            console.log('Users retrieved successfully');
            res.render('profilelist', {
              data: results,
              authenticated: authenticated
            });
          }
      }, -1);
  } else 
    res.render('authenticationError');
});


router.post('/todoapi', function(req, res, next) {

  switch(req.body.reqType){
    case('insert-todo'):
      database.preInsertTodoSet(req.body.json, req.user.id, function(err){
      if(err)
        res.sendStatus("500");
      else{
        res.sendStatus("200");
      }
      });
    break;

    case('get-todo'):
      database.getTodoSets(req.user.id, function(err, results){
        res.json(results[0]);
      })
    break;
  }

});



module.exports = router;
