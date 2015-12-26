var answers = [];
var main = function () {

    $(".submit").click( function(){
        console.log(answers);
        var fs = require('browserify-fs');
        var data = JSON.stringify(answers);
        fs.writeFile('swag.txt', 'apples');
        fs.writeFile('./config.json', data, function(err) {
            if (err) {
                console.log("Error in saving");
                console.log(err.message);
                return;
            }
            console.log('Configuration saved');
        }); 
    });

    $(".currAns").keypress( function(event) {
        var answer = String.fromCharCode(event.which);
        answers.push(answer);
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
        var html="<tr class="+(answers.length-1)+"><td>"+answer+"</td><tr>";
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
$(document).ready(main);
