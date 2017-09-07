var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var hbs = require('hbs');


var app = express();

// configuration
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
hbs.registerPartials(__dirname + '/views/partials/');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: false,
				 resave: true}));
app.use(passport.initialize());
app.use(passport.session());



app.use(require('./routes/index'));
app.use(require('./routes/story'));
app.use(require('./routes/bookstore'));
app.use(require('./routes/users'));
app.use(require('./routes/help'));
app.use(require('./routes/chat'));
app.use(require('./routes/entertain'));
app.use(require('./routes/admin'));
app.use(require('./routes/email'));
app.use(require('./routes/profile'));
app.use(require('./routes/comment'));
app.use(require('./routes/auth')(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
