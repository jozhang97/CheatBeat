/*Use Fleiss' Kappa 
To find number of possible solutions (A,B,C?) for a given problem, first zip arrays together, use set on each array and find the size()*/
var main = function () {
    /**$.ajax({
        url: 'results.json',
        type: 'POST',
        DataType: 'json',
        success: function(data) {
            #insert here
            },
        error: function() {
            alert("error. Try again later");
        }
    });*/
}

var grader = function(solutions, studentAns) {
    // assert solutions and student are arrays of the same length
    // returns grade student receives
    var max = solutions.length;
    var counter = 0;
    for (i=0;i<max;i++) {
        if (solutions[i] == studentAns[i]){
            counter++;
        }
    }
    return 1.0*counter/max;
};
var gradeAllTests = function(solutions, students) {
    // assert solutions is an array and students is an array of student answers
    // returns array of grades
    var grades = [];
    for (i=0;i<students.length;i++){
        grades.push(grader(solutions,students[i]));
    }
    return grades
}

var zip = function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

Object.defineProperties(Array.prototype, 
{
    count: 
    {
        value: function(value) 
        {
            return this.filter(function(x) {return x==value}).length
        }
    }
});

var sum = function sum(array) 
{
    return array.reduce(function(x,y) {
        return x+y;
    });
}

var numOptions = function numOptions (answersToEachQuestion)
{
    // number of possible answers to each question
    var possibleAnswers = [];
    for (var i=0; i<answersToEachQuestion.length; i++) 
    {
        possibleAnswers.push(new Set(answersToEachQuestion[i])); 
    }
    return possibleAnswers;
}       

var pRandom = function pRandom (answersToEachQuestion) 
{
    // Convert Set of Set to Array of Array
    var possibleAnswers = Array.from(numOptions(answersToEachQuestion));
    for (var i=0;i<possibleAnswers.length;i++)
    {
        possibleAnswers[i] = Array.from(possibleAnswers[i]);
    }
    var amountOfThatAnswer = [];
    var problemI = [];
    for (var i=0; i<answersToEachQuestion.length; i++) 
    {
        problemI = [];
        for (var j=0; j<possibleAnswers[i].length; j++)
        {
            problemI.push( answersToEachQuestion[i].count( possibleAnswers[i][j]));
        }
        amountOfThatAnswer.push(problemI);
    }
    console.log(amountOfThatAnswer);
    var probabilities= [];
    var summer = 0;
    for (var i=0; i<amountOfThatAnswer.length;i++)
    {
        summer = 0;
        for (var j=0; j<amountOfThatAnswer[i].length; j++) 
        {
            summer += Math.pow(amountOfThatAnswer[i][j],2); 
        } 
        probabilities.push(1.0*summer/Math.pow(answersToEachQuestion[i].length,2));
    }
    console.log(probabilities);
    return 1.0*sum(probabilities)/Math.pow(probabilities.length,1);
}

var controller = function controller () 
{
    var aandom = pRandom([ ["C", "A", "C", "B", "D"], ["A","C","D","B","C"] ]);
    var andom = pRandom([ ['A','B','D','C','D'], ['B','A','D','C','B'], ['D','B','A','C','A'], ['A','B','C','D','C'], ['A','B','C','D','D'] ]);
    return aandom;
}
/*
window.onload = function() {
    solutions = localStorage.master; 
    studentAns = localStorage.studentAns; // Array of student answers, first element is name
        // ex. [ ["Jeff", "A", "C"] ["Rohan", "C", "A"] ]
    answersToEachQuestion = zip(studentAns);
    answersToEachQuestion.shift();
    document.getElementById('solutions').innerHTML = "Solutions: " + solutions;
};

$(document).ready(main);*/
