(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var answers = [];
var main = function () {

    $(".submit").click( function(){
        console.log(answers);
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
    });

    $(".currAns").keypress( function(event) {
        var answer = String.fromCharCode(event.which);
        answers.push(answer);
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
        var html="<tr id="+(answers.length-1)+"><td><a href='#'>"+answer+"</a></td><tr>";
        $(".submittedAns").append(html)
        $(this).val("");
    });

    $(".clearButton").click( function(){
        answers=[]
        $(".submittedAns").text(String(answers));
        var str=String(answers.length)+" Questions Added so far";
        $("#questionCounter").text(str);
    });

    $("#thetable").click( function(event){
        console.log(event);
    });
}
$(document).ready(main);

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1]);
