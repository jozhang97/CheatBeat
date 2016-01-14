// Work on sessions/cookies, CSRF, middleware, requireLogin(34:00)
var utils = require('./utils');

utils.createApp().listen(9000);
var express = require('express');
var app = express();

module.exports = app;

/*
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


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
*/
