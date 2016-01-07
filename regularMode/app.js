var express = require('express');
var path = require('path');
var csrf = require('csurf');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // middleware

var routes = require('./routes/index');
var users = require('./routes/users');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Users = mongoose.model('Users', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String, 
    email: {type: String, unique: true},
    password: String,
}));

var sessions = require('client-sessions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongoose.connect('mongodb://localhost/newauth');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));//t or f
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(csrf());
// IDK WHERE THIS GO
// app.use(sessions({
//     cookieName: "session",
//     secret: "cheesetastejijiji12e12esgreat",
//     duration: 30*60*1000, //time(ms) before cookie expires
//     activeDuration: 5*60*1000, //extra time when do something
//     httpOnly: true,
//     secure: true,
//     ephemeral: true,
// }));

app.use('/', routes);
app.use('/login', routes);
app.use('/dashboard',routes);
app.use('/register', routes);
app.use('/users', users);
app.use('/logout', routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
