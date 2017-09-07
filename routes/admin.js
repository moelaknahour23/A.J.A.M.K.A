var express = require('express');
var router = express.Router();
var database = require('../custom_modules/database');

var allowedAdmins = ['mohammadlaknahour@yahoo.com', 'alvinrico.ortega.41@my.csun.edu', 'zharigan@gmail.com',
                     'shapourrezalak@gmail.com', 'mohammad.laknahour.115@my.csun.edu'];

/* GET home page. */
router.get('/admin', function(req, res) {

  //var authenticated = req.isAuthenticated();
    
  if(true){

    database.getStories(database.STORYSTATUS.DISAPPROVED_ONLY, function(err, results){
        if(err)
            console.log("There was an error getting stories");
        else 
            renderAdmin(res, results);
    });
  } else 
    res.render('authenticationError');
});

router.post('/admin', function(req, res){
    //Handle admin functions
    if(req.isAuthenticated() && isAdmin(req.user.email)){
        handleAdminApi(req, res);
    } else {
        //Unauthorized
        res.sendStatus('401');
    }
});


function renderAdmin(res, storiesArray){
    res.render('admin', {
        stories: storiesArray
    });
}

function handleAdminApi(req, res){
    console.log("Admin post");
    var requestType = req.body.reqType;
    console.log(requestType);
    switch(requestType){
        case 'disapprove':
        break;
        case 'approve':
            approveStory(req.body.id);
        break;
    }

    function approveStory(id){
        database.approveStory(id, function(err){
            if(err){
                res.sendStatus(500);
            }
            res.sendStatus(200);
        });
    }
}

function isAdmin(email){
    console.log(email);
    return (allowedAdmins.indexOf(email) > -1);
}

module.exports = router;
