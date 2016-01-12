var express = require('express');
var bcrypt = require('bcryptjs');

var models = require('../models');
var utils = require('../utils');

var results = require('../resultsAnalysis.js');
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
        }
    });
    user.save( function(err) {
        if (err) {
            var error = "Something bad happened. Try again!";
            if (err.code === 11000){
                error = "That email is already taken. Please use another.";
            }
            res.render('register.hbs', {title: 'Register', error: error, csrfToken: req.csrfToken()});
        }
        else {
            req.session.user = user;
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
    var html = "";
    models.User.findOne({email: req.session.user.email},function(err,user) 
    {
        if(err)
        {
            res.redirect({error:"Something went wrong. Try again later"}, 'dashboard');
        }
        else 
        {
            var tests = user.data['testName'];
            var location = ''
            var idClick = ''
            var test = '';
            var testSplit = [];
            for (var i=0; i<tests.length;i++)
            {
                test = tests[i]
                testSplit = test.split(" ");
                if(testSplit.length ==1)                
                {    
                    html += "<tr> <a href =/previousGrades/" + test + ">" + test + "</a></tr> </br>";
                }
                else
                {
                    test = ''
                    for (var j=0;j<testSplit.length-1;j++)
                    {
                        test += testSplit[j];
                        test += "_";
                    }
                    test += testSplit[testSplit.length-1];
                    html += "<tr> <a href =/previousGrades/" + test + ">" + tests[i]+ "</a></tr> </br>";
                }
            }
            res.render('previousGrades', {title: 'Tests', tableElements: html});
        }
    });
});

// passed in the data of which test by storing the data in the url 
router.get('/previousGrades/:id', function(req,res)
{
    var url = req.originalUrl;
    var urlSplit = url.split('/');
    var extension = urlSplit[urlSplit.length-1];
    var extensionSplit = extension.split('_');
    if (extensionSplit.length != 1)
    {    
        extension = '';
        for (var i=0; i<extensionSplit.length-1;i++)
        {
            extension += extensionSplit[i];
            extension += " ";
        }
        extension += extensionSplit[extensionSplit.length-1];
    }

    models.User.findOne({email: req.session.user.email}, function(err,user)
    {
        if(err) { res.redirect({error:err}, 'previousGrades'); }
        else 
        {
            var index = user.data.testName.indexOf(extension);
            if (index < 0) { res.redirect( {error: "Try again"}, 'previousGrades'); }
            else 
            {
                var solutions = user.data.solutions[index];
                var solutionsArray = solutions.split(',');
                var studentInfo = user.data.studentAnswers[index];
                var studentNames = studentInfo['name'];
                var studentAnswers = studentInfo['answers'];
                var compiled = []; //convert data to way we want
                for (var i=0; i<studentNames.length;i++)
                {
                    compiled.push([studentNames[i]]);
                    compiled[i].push.apply(compiled[i], studentAnswers[i].split(','));
                }
                var html = results.loadGrades(solutionsArray, compiled)
                res.render('previousGradesMoreInfo', {title: extension, tableElements: html});
                
            }
        }
    });
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
            user.data.testName.push(testName);
            user.data.solutions.push(solutions);
            user.save(function(err)
            {
                if(err)
                {
                    var error = "Something bad has happened! Please try again.";
                    res.render('grade', {title: "Grade",error:error});
                }
                else 
                {
                    res.redirect('gradeStudents');
                }
            });
        }
    });
});

router.get('/gradeStudents', utils.requireLogin, function(req,res) 
{
    res.render('gradeStudents', {title: "Students", csrfToken: req.csrfToken()})
});

router.post('/gradeStudents', utils.requireLogin, function(req,res)
{
      dataHelper(req,res,req.body.location);
    
});

var dataHelper = function (req,res,location) 
{
    var name = req.body.name;
    var studentAnswers = req.body.solutionKey;    
    models.User.findOne({email: req.session.user.email}, function(err,user)
    {
        if (err) 
        {
            console.log(err);
            console.log("error in finding");
            res.redirect('gradeStudents');
        }
        else
        {
            if (user.data.studentAnswers.length < user.data.testName.length)
            {
                var tempData = {
                    name: [name],
                    answers: [studentAnswers],
                };
                user.data.studentAnswers.push(tempData);
            }
            else
            {
                var arraySize = user.data.testName.length;
                user.data.studentAnswers[arraySize-1].name.push(name);
                user.data.studentAnswers[arraySize-1].answers.push(studentAnswers);
            }
            user.save(function(err)
            {
                if(err)
                {
                    console.log(err);
                    console.log("Error in saving. Try again later.");
                    res.redirect('gradeStudents');
                }
                else 
                {
                    console.log(user.data);
                    res.redirect(location);
                }
            })
        }

    });
};

router.get('/results', function(req,res)
{
    res.render('results', {title: "Results"
        // , csrfToken: req.csrfToken()
    })
});

router.get('/potCheaters', function(req,res) {
    // boundary conditions: one test graded, no tests graded
    models.User.findOne({email: req.session.user.email}, function(err,user)
    {
        if(err) {res.redirect({error: err},"dashboard")}
        else
        {
            var studentAnswers = user.data.studentAnswers;
            var reformatted = results.converter(studentAnswers);
            var html = results.loadCheaters(reformatted);
            res.render('potCheaters', {title: "Cheating", tableInfo: html});
        }
    });
});


router.get('/masterEntry', function(req,res)
{
    res.render('masterEntry',{title: "QuickGrade Solutions"});
});

router.get('/studentEntry', function(req,res)
{
    res.render('studentEntry', {title: "QuickGrade Students"});
});

router.get('/quickResults', function(req,res)
{
    res.render('quickResults', {title: "QuickGrade results"});
});

router.get('/logout', function(req, res) {
    if (req.session)
    {
        req.session.reset(); // ***
    }
    res.redirect('/');
});
module.exports = router;

