
var bodyParser = require('body-parser'); 
var csrf = require('csurf');
var express = require('express');
var mongoose = require('mongoose');
var session = require('client-sessions');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var middleware = require('./middleware');

module.exports.createUserSession = function(req,res,user)
{
	var cleanUser = {
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		data: user.data || {},
	};
	req.session.user = cleanUser;
	req.user = cleanUser;
	res.locals.user = cleanUser;
};

module.exports.createApp = function() 
{
	mongoose.connect('mongodb://localhost/authentication');
	var app = express();

	app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));//t or f
	app.use(session( {
		cookieName: "session",
		secret: "swagload",
		duration: 30*60*1000,
		activeDuration: 5*60*1000,
        //HTMLOnly: true,
        //secure: true,
        //ephemeral: true,
	}));
	app.use(csrf());
	app.use(middleware.simpleAuth);

	app.use(require('./routes/index.js'));
	app.use(require('./routes/users.js'));

	return app;
};


module.exports.requireLogin = function (req,res,next) 
{
	if (!req.user) 
	{
		res.redirect('/login');
	}
	else 
	{
		next();
	}
};











