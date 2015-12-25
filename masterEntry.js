var answers = [];
var main = function () {
    $(".submit").click( function(){
        console.log(answers);
    });
    $(".currAns").keypress( function(event) {
        var answer = String.fromCharCode(event.which);
        var html="<p>"+answer+"</p>";
        answers.push(answer);
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
        $(html).appendTo("#answersCont");
        $(this).val("");
    });
}
$(document).ready(main);
