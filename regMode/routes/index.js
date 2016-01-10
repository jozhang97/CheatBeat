var express = require('express');
var bcrypt = require('bcryptjs');

var models = require('../models');
var utils = require('../utils');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user)
  {
     res.render('dashboard', {title: 'Dashboard'})
  }
  else {
    res.render('index', { title: 'Express' });
  }
});

router.get('/register', function(req,res) {
    res.render('register', {title: 'Register', csrfToken: req.csrfToken()});
});

router.post('/register', function(req,res) {
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    var user = new models.User(
    {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash, 
        data: {
            testName: [],
            solutions: [],
            studentAnswers: [],
        }
    });
    user.save( function(err) {
        if (err) {
            var err = "something bad happened. Try again!";
            if (err.code === 11000){
                err = "that email is already taken";
            }
            res.render('register.hbs', {title: 'Register', error: err, csrfToken: req.csrfToken()});
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

router.get('/login', function(req,res) {
    res.render('login', {title: 'Login', csrfToken: req.csrfToken()});
});

router.post('/login', function(req, res) {
    models.User.findOne({email:req.body.email}, function(err, user) {
        if(!user) {
            res.render('login', {title:'Login', error: 'Invalid user/password', csrfToken: req.csrfToken()});
        }
        else {
            if (bcrypt.compareSync(req.body.password, user.password)){
                utils.createUserSession(req,res,user);
                res.redirect('/dashboard');
            }
            else {
                res.render('login', {title: 'Login',error: 'invalid user/password', csrfToken: req.csrfToken()});
            }
        }
    });
});

router.get('/dashboard', utils.requireLogin,function(req,res) {
    res.render('dashboard',{title: 'Dashboard' });
});

router.get('/previousGrades', function(req,res) {
    res.render('previousGrades');
});

router.get('/grade', utils.requireLogin, function(req,res) {
    res.render('grade', {title: 'Grade', csrfToken: req.csrfToken()});
});

router.post('/grade', function(req,res) {
    var testName = req.body.testName;
    var solutions = req.body.solutionKey;
    models.User.findOne({email: req.session.user.email}, function(err,user)
    {
        if (err) 
        {
            console.log(err);
            res.redirect("/dashboard", {title: "Dashboard"});
        }
        else 
        {
            // var tempData = {
            //     testName: user.data.testName,
            //     solutions: user.data.solutions,
            //     studentAnswers: user.data.studentAnswers,
            // }
            // tempData.testName.push([testName]);
            // tempData.solutions.push([solutions]);
            // user.data = tempData;
            user.data.testName.push([testName]);
            user.data.solutions.push([solutions]);
            user.save(function(err)
            {
                if(err)
                {
                    var error = "Something bad has happened! Try again.";
                    res.render('grade', {title: "Grade",error:error});
                }
                else 
                {
                    console.log(user.data)
                    res.redirect('gradeStudents');
                }
            });
        }
    });
});

router.get('/gradeStudents', function(req,res) 
{
    res.render('gradeStudents', {title: "Students"})
});

router.get('/potCheaters', function(req,res) {
    res.render('potCheaters');
});

router.get('/logout', function(req, res) {
    if (req.session)
    {
        req.session.reset(); // ***
    }
    res.redirect('/');
});
module.exports = router;

