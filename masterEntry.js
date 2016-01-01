var answers = [];
var main = function () {

    $("#submit").click( function(){
        console.log(answers);
        localStorage.setItem('master',JSON.stringify(answers))
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
            var answer = String.fromCharCode(event.which);
            answers.push(answer);
            if(localStorage.master == null){
                var str=String(answers.length)+" Questions Added so far";
            }
            else{
                var str=String(answers.length)+"/"+JSON.parse(localStorage.master).length+" Questions Added so far";
            }
            $("#questionCounter").text(str);
            var idname='row'+(answers.length-1)
            var html="<tr id="+idname+"><td><a href='#'>"+answer+"</a></td></tr>";
            $(".submittedAns").append(html)
            $(this).val("");
            if(answers.length == JSON.parse(localStorage.master).length){
                $("#currAns").hide();
            }
        });
    }

    $("#clearButton").click( function(){
        answers=[];
        $(".submittedAns").text(String(answers));
        $("#currAns").show();
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
    });
}
var change= function(){
    var rowNumber=$(this).index();
    var idname="#row"+rowNumber;
    var newAns=window.prompt("What do you want to change it to?","");
    if (newAns!=null){
        answers[rowNumber]=newAns;
        $(idname).html("<a href='#'>"+newAns+"</a>");
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

