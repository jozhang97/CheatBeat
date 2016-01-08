var answers = [];
var main = function () {
    if (answers.length ==0) {
        $('#clearButton').hide();
    }
    $("#submit").click( function(){
        console.log(answers);
        localStorage.setItem('master',JSON.stringify(answers))
        window.location.href = "studentEntry.html";
        /**
        var fs = require('fs');
        var data = JSON.stringify(answers);
        var foo = fs.writeFile('swag.txt', 'apples');
        var fooo = fs.writeFile('./config.json', data, function(err) {
            if (err) {
                console.log("Error in saving");
                console.log(err.message);
                return;
            }
            console.log('Configuration saved!!!');
        });
        */
    });
    
    $("#submitAll").click(studentStoring);
    $("#nextStudent").click(studentStoring);

    if(localStorage.master == null || (JSON.parse(localStorage.master).length>answers.length)) {
        $("#currAns").keypress( function(event) {
            $("#clearButton").show();
            var answer = String.fromCharCode(event.which);
            answers.push(answer);
            if(localStorage.master == null){
                var str=String(answers.length)+" Questions Added so far";
            }
            else{
                var str=String(answers.length)+"/"+JSON.parse(localStorage.master).length+" Questions Added so far";
            }
            $("#questionCounter").text(str);
            var idname='row'+(answers.length-1);
            var html="<tr id="+idname+"><td class='rowElements'> <a href='#'>"+answer+"</a></td></tr>";
            if (answers.length > 5) {
                var rowNum=(answers.length-1) % 5;
                $("#row"+rowNum).append("<td class='rowElements'> <a href='#'>"+answer+"</a></td>");
            }
            else{
                $(".submittedAns").append(html);
            }
            $(this).val("");
            if(localStorage.master != null && answers.length == JSON.parse(localStorage.master).length){
                $("#currAns").hide();
            }
        });
    }

    $("#clearButton").click( function(){
        answers=[];
        $("#clearButton").hide();
        $(".submittedAns").text(String(answers));
        $("#currAns").show();
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
    });
}
var change= function(){
    var rowNumber=$(this).index();
    var idname="#row"+rowNumber;
    var newAns=window.prompt("What do you want to change it to?");
    if (newAns!=null){
        answers[rowNumber]=newAns;
        $(idname).html("<td class='rowElements'> <a href='#'>"+newAns+"</a></td>");
    }
    else{
        $(idname).html("<td class='rowElements'> <a href='#'>"+answers[rowNumber]+"</a></td>");
    }
}

var studentStoring = function()
{
    var name=String($("#name").val());
    var answerArray=[name];
    answerArray.push.apply(answerArray,answers);
    answerArray=[answerArray];
    if (localStorage.students == null){
        localStorage.setItem('students',JSON.stringify(answerArray));
    }
    else{       
        var studentArray=JSON.parse(localStorage.students);
        studentArray.push(answerArray[0]);
        localStorage.setItem('students',JSON.stringify(studentArray));
    }
}

$(document).ready(main).on('click','#thetable tr', change);

