var express = require('express');
var bcrypt = require('bcryptjs');

var models = require('../models');
var utils = require('../utils');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req,res) {
    res.render('register', {csrfToken: req.csrfToken()});
});

router.post('/register', function(req,res) {
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new models.User(
    {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash, 
    });
    user.save( function(err) {
        if (err) {
            var err = "something bad happened. Try again!";
            if (err.code === 11000){
                err = "that email is already taken";
            }
            res.render('register.jade', {error: err});
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

router.get('/login', function(req,res) {
    res.render('login', {csrfToken: req.csrfToken()});
});

router.post('/login', function(req, res) {
    models.User.findOne({email:req.body.email}, function(err, user) {
        if(!user) {
            res.render('login.jade', {error: 'Invalid user/password', csrfToken: req.csrfToken()});
        }
        else {
            if (bcrypt.compareSync(req.body.password, user.password)){
                utils.createUserSession(req,res,user);
                res.redirect('/dashboard');
            }
            else {
                res.render('login.jade', {error: 'invalid user/password', csrfToken: req.csrfToken()});
            }
        }
    });
});

router.get('/dashboard', utils.requireLogin,function(req,res) {
    res.render('dashboard');
});

router.get('/logout', function(req, res) {
    if (req.session)
    {
        req.session.reset(); // ***
    }
    res.redirect('/');
});
module.exports = router;
