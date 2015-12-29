var answers = [];
var main = function () {

    $(".submit").click( function(){
        console.log(answers);
        localStorage.master = answers;
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

    $(".currAns").keypress( function(event) {
        var answer = String.fromCharCode(event.which);
        answers.push(answer);
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
        var idname='row'+(answers.length-1)
        var html="<tr id="+idname+"><td><a href='#'>"+answer+"</a></td><tr>";
        $(".submittedAns").append(html)
        $(this).val("");
    });

    $(".clearButton").click( function(){
        answers=[]
        $(".submittedAns").text(String(answers));
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
    });
}
var change= function(){
    var rowNumber=$(this).index()/2;
    var idname="#row"+rowNumber;
    var newAns=window.prompt("What do you want to change it to?","");
    if (newAns!=null){
        answers[rowNumber]=newAns;
        $(idname).html("<a href='#'>"+newAns+"</a>");
    }
}

$(document).ready(main).on('click','#thetable tr', change);

