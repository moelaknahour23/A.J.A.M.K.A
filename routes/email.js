var express = require('express');
var router = express.Router();
var jsonReader = require('jsonfile');
var database = require('../custom_modules/database');
var mockData;

var express = require('express');
var router = express.Router();

var email 	= require("emailjs");
var server 	= email.server.connect({
   user:    "shapourrezalak@gmail.com", 
   password:"moe12345", 
   host:    "smtp.gmail.com", 
   ssl:     true
});


router.get('/mentor', function(req, res, next) {
  var authenticated = req.isAuthenticated();
  if(authenticated){
    database.getMentors(function(err, results){
      console.log(results);
        res.render('mentor', {
          data: results,
          authenticated: authenticated
        });
    });
  } else {
    res.render('authenticationError');
  }
});


router.post('/email', function(req, res){
  var authenticated = true;
  //var authenticated =  req.isAuthenticated();

  var mentorid = req.body.mentorid;
  var mentor = database.getMentor(parseInt(mentorid), function(err, results){
    if(err) res.sendStatus(500);
    else {
      if(authenticated){
        sendToEmail(results[0].name, results[0].email, req.body.email); //Still sends from shapou...!
      } else {
        res.sendStatus(401);
      }
    }
  });

  function sendToEmail(recipientName, email, from){

    var inquiryFlavorText = 
      "A user with email " + from +
      " has used the contact form on AJAMKA with this message: \n\n" +
      req.body.message;

    var emailObj = {
      text: inquiryFlavorText,
      from: req.body.name + " <" + from + ">",
      to: "Mentor " + recipientName + " <" + email + ">",
      subject: "Inquiry from AJAMKA"
    }

    server.send(emailObj, function(err, message){
      console.log(err || message);
    });
  }
});






// send the message and get a callback with an error or details of the message that was sent 
// server.send({
//    text:    "i hope this works", 
//    from:    "moe$$ <shapourrezalak@gmail.com>", 
//    to:      "someone <mohammadlaknahour@yahoo.com>",
//    cc:      "else <else@your-email.com>",
//    subject: "testing emailjs"
// }, function(err, message) { console.log(err || message); });
    
        




module.exports = router;
