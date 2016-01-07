var express = require('express');
var bcrypt = require('bcryptjs');
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
 
 //IDK WHERE THIS GOES, SESSIONS STUFF
var sessions = require('client-sessions');
// app.use(sessions({
//     cookieName: "session",
//     secret: "cheesetastejijiji12e12esgreat",
//     duration: 30*60*1000, //time(ms) before cookie expires
//     activeDuration: 5*60*1000, //extra time when do something
// add security implementations
// }));

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req,res) {
    res.render('register');
});

router.post('/register', function(req,res) {
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new User(
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
    res.render('login');
});

router.post('/login', function(req, res) {
    User.findOne({email:req.body.email}, function(err, user) {
        if(!user) {
            res.render('login.jade', {error: 'Invalid user/password'})
        }
        else {
            if (bcrypt.compareSync(req.body.password, user.password)){
            //    res.session.user = user; 
                res.redirect('/dashboard');
                console.log('passwords match');
            }
            else {
                res.render('login.jade', {error: 'invalid user/password'})
            }
        }
    });
});

router.get('/dashboard', function(req,res) {
    if (req.session && req.session.user) {
        User.findOne({email: req.session.user.email},
            function(err,user) {
            if (!user) {
                req.sesion.reset();
                res.redirect('/login');
            } else {
                res.locals.user = user; //lets us use user object in jade
                res.render('dashboard.jade');
            }
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', function(req, res) {
    res.session.reset(); // ***
    res.redirect('/');
});
module.exports = router;
