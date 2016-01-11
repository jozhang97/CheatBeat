var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;


var User = mongoose.model('User', new Schema({
    id: ObjectId,
	firstName:    { type: String, required: '{PATH} is required.' },
	lastName:     { type: String, required: '{PATH} is required.' },
	email:        { type: String, required: '{PATH} is required.', unique: true },
	password:     { type: String, required: '{PATH} is required.' },
	data:         {
        testName: [String],
        solutions: [[String]],
        studentAnswers: [{
            name: [String],
            answers: [[String]],
        }],
    } ,
    results: [Number],
    cheat: [ [String, String, Number]],
    
    // {testName, solutions, studentAnswers

}));

module.exports.User = User;
