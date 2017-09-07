const TABLE_STORIES = 'stories';
const TABLE_USERS = 'users';
const TABLE_CHAT = 'chatmessages';
const TABLE_COMMENT = 'comments';
const TABLE_COMMENTSET = 'commentset';
const TABLE_MENTOR = 'mentor';
const TABLE_TODO = 'todoitems';
const TABLE_TODO_JSON = 'todoset';
var mysql = require('mysql2');
var connection;

//Enumerator
var STORYSTATUS = {
    ALL: 1,
    APPROVED_ONLY:2,
    DISAPPROVED_ONLY: 3
}

exports.STORYSTATUS = STORYSTATUS;



init();

function init(){
      connection = mysql.createConnection({host:'ajamka.cmaaosydil6d.us-east-1.rds.amazonaws.com', user: 'ajamka', password: 'ajamka4321', database: 'ajamka'});
}


exports.findOrCreateUser = function(email, verifyCallback){
    var user = {
        email: email,
        nickname: email,
    };
    connection.execute('SELECT email, nickname, id, firstTime FROM users WHERE email = ?', [email], function(err, results, fields){
        if(err){
            console.log('Error occurred when trying to select a user from the database with email: ' + email);
            verifyCallback(err);
        } else {
            console.log('Successfully seeked user from database with email: ' + email);
            if(results.length > 0){
                console.log('Google user:' + email + " exists in database.");
                user.id = results[0].id;
                user.nickname = results[0].nickname;
                user.firstTime = results[0].firstTime;
                console.log(user);
                verifyCallback(err, user);
            } else {
                console.log('Google user:' + email + " does not exist in the database... inserting user...");
                insertUser(email, verifyCallback);
            }
        }
    });

    function insertUser(id, callback){
        var default_aboutme = "User currently has not setup an about me description.";
        var default_description = "User currently has not setup a short description.";
        var default_profilePic = "/images/default.gif";
        connection.execute('INSERT INTO users (email, nickname, description, aboutme, avatarLink) VALUES (?, ?, ?, ?, ?)', [id, id, default_description, default_aboutme, default_profilePic], function(err, results, fields){
            if(err) {
                console.log("Error adding user into database!");
                callback(err);
             }
            else {
                user.id = results.insertId;
                user.firstTime = 1;
                console.log(user);
                callback(null, user);
            }
        });
    }
}


exports.updateUser = function(id, key, val, verifyCallback){
    connection.execute('UPDATE ' + TABLE_USERS + ' SET ' + key + '=' + '? WHERE id = ?', [val, id], function(err, results, fields){
        if(err){
            console.log('Error occurred when trying to update a user from the database with id: ' + id);
            verifyCallback(err);
        } else {
            console.log('Successfully updated user from database with id: ' + id);
            verifyCallback(err);
        }
    });
}

exports.updateFirstTimeUser = function(id, nickname, verifyCallback){
    console.log('Updating first time user: ' + nickname);
    connection.execute('UPDATE ' + TABLE_USERS + ' SET nickname=?, firstTime=0 WHERE id=?', [nickname, id], function(err, results, fields){
        if(err){
            console.log('Error occurred when trying to update a user from the database with id: ' + id);
            verifyCallback(err);
        } else {
            console.log('Successfully updated user from database with id: ' + id);
            verifyCallback(err);
        }
    });
}

//Pagination -1 returns all!
exports.getUsers = function(callback, pagination){
    console.log("Beginning retrieval of users");
    connection.execute('SELECT * FROM ' + TABLE_USERS, [], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve users from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved users from database.");
            callback(null, results);
        }
    });
    return true;
}

exports.getUser = function(id, callback){
    console.log("Beginning retrieval of user");
    connection.execute('SELECT * FROM ' + TABLE_USERS + ' WHERE id=?', [id], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve users from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved users from database.");
            callback(null, results);
        }
    });
    return true;
}


exports.insertStory = function(id, author, title, content, textContent){
    console.log("Beginning insertion");
    connection.execute('INSERT INTO ' + TABLE_STORIES + ' (author, authorName, title, content, summary) VALUES (?, ?,?,?,?)', [id, author, title, content, textContent.substring(0, 
    (textContent.length >= 50) ? 50 : textContent.length)], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying insert story into database: " + err.code);
            return null;
        } else 
            console.log("Successfully inserted story into database.");
    });
    return true;
}

exports.insertJournal = function(id, author, title, content, summary){
    console.log("Beginning insertion of journal");
    connection.execute('INSERT INTO ' + TABLE_STORIES + ' (author, authorName, title, content, summary, journal, approved) VALUES (?, ?,?,?,?, 1, 1)', [id, author, title, content, summary], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying insert journal into database: " + err.code);
            return null;
        } else 
            console.log("Successfully inserted journal into database.");
    });
    return true;
}

exports.getStories = function(storyStatus, callback){
    console.log("Beginning retrieval of story");

    var innerjoin = " INNER JOIN " + TABLE_USERS + " ON " + TABLE_USERS + ".id" + "=" + TABLE_STORIES + ".author";
    var colSelect = TABLE_STORIES + ".*, " + TABLE_USERS + ".nickname, " + TABLE_USERS + ".avatarLink ";

    var query;
    switch(storyStatus){
        case STORYSTATUS.ALL:
            query = "SELECT " + colSelect + "FROM " + TABLE_STORIES + innerjoin;
            break;
        case STORYSTATUS.APPROVED_ONLY:
            query = "SELECT " + colSelect + "FROM " + TABLE_STORIES + innerjoin + " WHERE approved=1 and journal=0";
            break;
        case STORYSTATUS.DISAPPROVED_ONLY:
            query = "SELECT " + colSelect + "FROM " + TABLE_STORIES + innerjoin + " WHERE approved=0";
            break;
    }

    connection.execute(query, [], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve stories from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved stories from database.");
            console.log(results);
            callback(null, results);
        }
    });
    return true;
}


exports.getStory = function(id, callback){
    console.log("Beginning retrieval of story with id: " + id);
    
    var innerjoin = " INNER JOIN " + TABLE_USERS + " ON " + TABLE_USERS + ".id" + "=" + TABLE_STORIES + ".author";
    var colSelect = TABLE_STORIES + ".*, " + TABLE_USERS + ".nickname, " + TABLE_USERS + ".id ";

    connection.execute("SELECT " + colSelect + "FROM " + TABLE_STORIES + innerjoin + " WHERE " + TABLE_STORIES + ".id=?", [id], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve story from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved story from database.");
            callback(null, results);
        }
    });
    return true;
}

exports.getStoriesOfUser = function(id, callback){
    console.log("Beginning retrieval of stories of user id: " + id);

    var innerjoin = " INNER JOIN " + TABLE_USERS + " ON " + TABLE_USERS + ".id" + "=" + TABLE_STORIES + ".author";
    var colSelect = TABLE_STORIES + ".*, " + TABLE_USERS + ".nickname ";

    connection.execute('SELECT ' + colSelect + 'FROM ' + TABLE_STORIES + innerjoin + " WHERE author=? AND approved=1 AND journal=0", [id], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve stories from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved stories from database.");
            callback(null, results);
        }
    });
    return true;
}

exports.getJournalOfUser = function(id, callback){
    console.log("Beginning retrieval of journals of user id: " + id);

    var innerjoin = " INNER JOIN " + TABLE_USERS + " ON " + TABLE_USERS + ".id" + "=" + TABLE_STORIES + ".author";
    var colSelect = TABLE_STORIES + ".*, " + TABLE_USERS + ".nickname ";

    connection.execute('SELECT ' + colSelect + 'FROM ' + TABLE_STORIES + innerjoin + " WHERE author=? AND journal=1", [id], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve journals from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved journals from database.");
            callback(null, results);
        }
    });
    return true;
}

exports.approveStory = function(id, callback){
    console.log("Beginning approval of story with id: " + id);
    connection.execute('UPDATE ' + TABLE_STORIES + " SET approved=? WHERE id=?", [1, id], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying to approve story from database: " + err.code);
            return null;
        } else {
            console.log("Successfully approved story from database.");
            callback(null);
        }
    });
    return true;
}

exports.deleteStory = function(){
    console.log("Testing delete story export function");
    return "Testing Delete";
}

exports.getChatMessages = function(chatroomid, callback){

    var innerjoin = " INNER JOIN " + TABLE_USERS + " ON " + TABLE_USERS + ".id" + "=" + TABLE_CHAT + ".authorid";
    var colSelect = TABLE_CHAT + ".*, " + TABLE_USERS + ".nickname ";

    console.log("Beginning retrieval of chats with id: " + chatroomid);
    connection.execute('SELECT ' + colSelect + 'FROM ' + TABLE_CHAT + innerjoin + " WHERE chatroomid=?", [chatroomid], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve chats from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved chats from database.");
            callback(null, results);
        }
    });
    return true;
}

exports.insertChatMessage = function(chatroomid, msg, author, callback){
    console.log("Beginning insertion of chat message: " + msg);

    var timestamp = new Date();

    connection.execute('INSERT INTO ' + TABLE_CHAT + ' (chatroomid, authorid, msg, time) VALUES (?,?,?,?)', [chatroomid, author, msg, timestamp], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying inserting message into database: " + err.code);
            return null;
        } else 
            console.log("Successfully inserted message into database.");
            callback(err);
    });
    return true;
}

exports.insertTodoItem = function(taskContent, author, orderIndex, callback){
    console.log("Beginning insertion of todo item: " + taskContent);

    var timestamp = new Date();

    connection.execute('INSERT INTO ' + TABLE_TODO + ' (taskContent, authorid, orderIndex, timestamp) VALUES (?,?,?,?)', [taskContent, author, orderIndex, timestamp], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying inserting todoitem into database: " + err.code);
            return null;
        } else 
            console.log("Successfully inserted message into database.");
            callback(err);
    });
    return true;
}

exports.preInsertTodoSet = function(json, author, callback){
    connection.execute('SELECT * FROM ' + TABLE_TODO_JSON + ' WHERE authorid=?', [author], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve Insert from database: " + err.code);
            return null;
        } else {
            if(results.length > 0){
                exports.updateTodoSet(json, author, function(){
                    callback(null, results);
                });
            } else {
                exports.insertTodoSet(json, author, function(){
                    callback(null, results);
                });
            }
        }
    });
    return true;
}

exports.getTodoSets = function(author, callback){
    connection.execute('SELECT json FROM ' + TABLE_TODO_JSON + ' WHERE authorid=?', [author], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve todoset from database: " + err.code);
            return null;
        } else {
            callback(null, results);
        }
    });
    return true;
}

exports.insertTodoSet = function(json, author, callback){
    console.log("Beginning insertion of todo set");
    connection.execute('INSERT INTO ' + TABLE_TODO_JSON + ' (json, authorid) VALUES (?,?)', [json, author], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying inserting todo set into database: " + err.code);
            return null;
        } else 
            console.log("Successfully inserted todo set into database.");
            callback(err);
    });
    return true;
}

exports.updateTodoSet = function(json, author, callback){
    console.log("Beginning update of todo set");
    connection.execute('UPDATE ' + TABLE_TODO_JSON + ' SET json=? WHERE authorid=?', [json, author], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying to update todo set into database: " + err.code);
            return null;
        } else 
            console.log("Successfully updated todo set in database.");
            callback(err);
    });
    return true;
}

exports.getMentor = function(id, callback){
    console.log("Beginning retrieval of mentor of id:" + id);
    connection.execute('SELECT * FROM ' + TABLE_MENTOR + ' WHERE id=?', [id], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve mentor from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved mentor from database.");
            callback(null, results);
        }
    });
    return true;
}

exports.getMentors = function(callback){
    console.log("Beginning retrieval of mentors");
    connection.execute('SELECT * FROM ' + TABLE_MENTOR, [], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve mentors from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved mentors from database.");
            callback(null, results);
        }
    });
    return true;
}

exports.insertComment = function(setid, msg, authorid, callback){
    console.log("Beginning insertion of comment message: " + msg);
    connection.execute('INSERT INTO ' + TABLE_COMMENT + ' (setid, authorid, msg) VALUES (?,?,?)', [setid, authorid, msg], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying inserting comment into database: " + err.code);
            return null;
        } else 
            console.log("Successfully inserted comment into database.");
            callback(err);
    });
    return true;
}

exports.getComments = function(setid, callback){
    console.log("Beginning retrieval of comments with id: " + setid);
    connection.execute('SELECT * FROM ' + TABLE_COMMENT + " WHERE setid=?", [setid], function(err, results, fields){
        if(err){
            console.log("Error occurred when trying retrieve comments from database: " + err.code);
            return null;
        } else {
            console.log("Successfully retrieved chats from database.");
            callback(null, results);
        }
    });
    return true;
}