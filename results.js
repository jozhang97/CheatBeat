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



window.onload = function() {
    solutions = localStorage.master; 
    document.getElementById('solutions').innerHTML = "Solutions: " + solutions;
};

$(document).ready(main);
