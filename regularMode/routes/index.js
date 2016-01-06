var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var User = mongoose.model('User', new Schema({
    id: ObjectId,
    firstName: String,
    lastName: String, 
    email: {type: String, unique: true},
    password: String,
}));

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req,res) {
    res.render('register');
});

router.post('/register', function(req,res) {
    var user = new User(
    {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
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
    res.render('login');
});

router.post('/login', function(req, res) {
    User.findOne({email:req.body.email}, function(err, user) {
        if(!user) {
            res.render('login.jade', {error: 'Invalid user/password'})
        }
        else {
            if (req.body.password === user.password) {
                res.redirect('/dashboard');
            }
            else {
                res.render('login.jade', {error: 'invalid user/password'})
            }
        }
    });
});

router.get('/dashboard', function(req,res) {
    res.render('dashboard', {firstName:'rohan', lastName:'narayan'});
});

router.get('/logout', function(req, res) {
    res.redirect('/');
});
module.exports = router;
