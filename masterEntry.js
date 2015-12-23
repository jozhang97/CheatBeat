var answers = [];
var main = function () {
    $(".submit").click( function(){
        console.log(answers);
    });
    $(".currAns").keypress( function(event) {
        var answer = String.fromCharCode(event.which);
        var html="<p>"+answer+"</p>";
        answers.push(answer)
        $(html).appendTo("#answersCont");
        $(this).val("");
    });
}
$(document).ready(main);
