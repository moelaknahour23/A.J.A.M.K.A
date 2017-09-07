var express = require('express');
var router = express.Router();
var io = require('socket.io')();
var database = require('../custom_modules/database');
this.io = io;
var socket = require('../custom_modules/socket');
var port = 3000;

var REQUEST_TYPE = {
    GET_CHAT_MESSAGES: 'get-messages',
    INSERT_CHAT_MSG: 'post-chat'
}

router.get('/chat', function(req, res) {

    var authenticated = req.isAuthenticated();
    
    if(authenticated){
        //Open specific chatroom depending on id:
        var chatroomid = parseInt(req.query.id);
        if(chatroomid){
            database.getChatMessages(chatroomid, function(err, results){
                    if(err){
                        res.sendStatus(500);
                    } else {                            
                            res.render('chat', {
                            authenticated: req.isAuthenticated(),
                            userData: req.user,
                            data: results,
                            chatroomid: chatroomid
                        });
                    }
            });
        } else {
            console.log("No id specified for chatroom, showing generic chatroom instead");
            
            //Render generic chatroom, remove this when id is implemented
            res.render('chat', {authenticated: req.isAuthenticated()});
        }
    } else 
        res.render('authenticationError');
})

router.get('/chathome', function(req, res){
    var authenticated = req.isAuthenticated();
        if(authenticated){
        res.render('chathome', {authenticated: req.isAuthenticated(),
            userData: req.user
        });
    } else {
        res.render('authenticationError');
    }
});

router.post('/chatapi', function(req, res){
    var reqType = req.body.reqType;

    switch(reqType){
        case REQUEST_TYPE.GET_CHAT_MESSAGES:
            database.getChatMessages(req.body.chatroomid, function(err, results){
                if(err){
                    res.sendStatus(500);
                } else {
                    res.json(results);
                }
            });
            break;
        
        case REQUEST_TYPE.INSERT_CHAT_MSG:
            database.insertChatMessage(req.body.chatroomid, req.body.msg, parseInt(req.user.id), function(err){
                if(err){
                    console.log("Error inserting chat message");
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
            break;
    }
});

module.exports = router;