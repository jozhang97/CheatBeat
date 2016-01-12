//put results.js methods in here 


var grader = function(solutions, studentAns) {
    // assert solutions and student are arrays of the same length
    // returns grade student receives
    var max = solutions.length;
    var counter = 0;
    for (var i=0;i<max;i++) {
        if (solutions[i] == studentAns[i]){
            counter++;
        }
    }
    return Math.round(10000.0*counter/max)/10000;
};

var gradeAllTests = function(solutions, students) {
    // assert solutions is an array and students is an array of student answers
    // returns array of grades
    var grades = [];
    for (var i=0;i<students.length;i++)
    {
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
    return 1.0*sum(probabilities)/Math.pow(probabilities.length,1);
}

var removeFirstElements = function remove(arrays)
{
    arrays = zip(arrays);
    arrays.shift();
    return zip(arrays);
}

var pObserved = function pObserved (studentAnswers) 
{
    // returns a jadded array of observed probabilities 
    // index i represents probabilities of same answer
    // between ith student and 
    // students from i+1 to end
    // [i][j]th is the ith student's coorelation with i+j+1th student
    var answers = removeFirstElements(studentAnswers);
    var pObs = [];
    var numStudents = answers.length;
    for (var i=0;i<numStudents;i++) 
    {
        pObs.push(gradeAllTests(answers[i], answers.slice(i+1)));
    }
    return pObs;
}

var computeKappa = function kappa (pObs,pRandom)
{
    var numerator = pObs - pRandom;
    if (numerator < 0) 
    {
        return 0;
    }
    var denominator = 1 - pRandom;
    return Math.round(1000*numerator/denominator)/1000;
}

var cheaters = function cheatingCalculator(studentAns) 
{
    var probRandom = pRandom(zip(removeFirstElements(studentAns)));
    var probsObs = pObserved(studentAns);
    var suspects = [];
    var kappas = probsObs.slice(0);    
    for (var i=0;i<kappas.length;i++)
    {
        for (var j=0;j<kappas[i].length;j++)
        {
            kappas[i][j] = computeKappa(probsObs[i][j],probRandom);
            if (kappas[i][j] > 0) 
            {
                suspects.push([kappas[i][j],studentAns[i][0],studentAns[j+i+1][0]]);
            }
        }
    }
    suspects.sort().reverse();
    return suspects;
}

var controller = function controller () 
{
    var sampleAnswers = [ ['rohan', 'D','B','C','D','D','C','A'], 
                          ['anant', 'C','B','C','D','D','C','A'],
                          ['john', 'A','B','C','D','D','A','C'],
                          ['SHANKAR',  'D','B','C','A','D','C','A'], 
                           ['jeff','A','D','B','B','D','A','C']];
    console.log(cheaters(sampleAnswers));
}

var loadSoln = function(solutions) {
    document.getElementById('solutions').innerHTML = "Solutions: " + solutions;
}

var loadGrades = function(solutions, studentAns) 
{
    var grades = gradeAllTests(solutions, removeFirstElements(studentAns));
    var html = "";
    var idname = "";
    var ret = "";
    for (var i=0;i<grades.length;i++)
    {
        idname = "row" + i;
        html = "<tr id ="+idname+"> <td id='name'>"+studentAns[i][0]+
            "</td> <td id='grade'>"+grades[i]*100+"%</td> </tr>";
        ret += html;
        //$("#nameGrades").append(html);
    }
    return ret;

}
 
var loadCheaters = function(studentAns) {
    var cheatingPair = cheaters(studentAns);
    var html = '';
    var idname = '';
    var ret = '';
    if (cheatingPair.length == 0)
    {
        html = "<tr id='noCheaters'> <td id='noCheating' colspan='2'> No cheating found! </td></tr>"
        // $("#cheaterPair").append(html); 
        ret = html
        return ret;   
    }
    for (var i=0;i<cheatingPair.length;i++)
    {
        idname = "cheatRow" +i;
        html = "<tr id="+idname+"> <td id='cheater1'>"+cheatingPair[i][1]+
            "</td> <td id='cheater2'>"+cheatingPair[i][2]+"</td><td id='prob'>"
            +cheatingPair[i][0]+"</td></tr>";
        // $("#cheaterPair").append(html);
        ret += html;
    }
    return ret;
}

// This method requires a big enough data set such that all 
// multiple choice answers are answered by at least one student 


var converter = function (studentAnswers)
{
    //converting the first one 
    var ret = [];
    var helper = [];
    var answersReformatted =[];

    var starter = studentAnswers.shift();

    for (var i=0;i<starter['name'].length;i++)
    {
        ret.push([starter['name'][i]   ]);
        answersReformatted = starter['answers'][i].split(',');
        ret[i].push.apply(ret[i], answersReformatted);
    }

    var maxLength = ret[0].length;

    // adding every other test 
    var names = zip(ret)[0];
    var name = '';
    var answers = '';

    for (var i=0; i<studentAnswers.length; i++)
    {
        for (var j=0; j < studentAnswers[i]['name'].length; j++)
        {
            helper = [];
            name = studentAnswers[i]['name'][j];
            answers = studentAnswers[i]['answers'][j];

            if (names.indexOf(name) > -1)
            {
                for (var k=0; k<ret.length;k++)
                {
                    if (ret[k][0] == name)
                    {
                        ret[k].push.apply(ret[k], answers.split(',')   );
                        if (ret[k].length > maxLength)
                            maxLength = ret[k].length;
                        break;
                    }
                }
            }
            else
            {
                helper = [];
                helper.push(name)
                for (var j=0; j<ret[0].length-1;j++)
                {
                    helper.push('');
                }
                helper.push.apply(helper, answers.split(',')  );
                ret.push(helper);
                if (helper.length > maxLength)
                    maxLength = helper.length;
            }
        }
        // pad person who didn't take second test with ""
        for (var j=0; j < ret.length; j++)
        {
            while (ret[j].length < maxLength)
            {
                ret[j].push('');
            }
        }
        names = zip(ret)[0];
    }
    return ret
};

module.exports.zip = zip;
module.exports.loadSoln = loadSoln;
module.exports.loadGrades = loadGrades;
module.exports.loadCheaters = loadCheaters;
module.exports.converter = converter; 


