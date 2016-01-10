var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;


var User = mongoose.model('User', new Schema({
    id: ObjectId,
	firstName:    { type: String, required: '{PATH} is required.' },
	lastName:     { type: String, required: '{PATH} is required.' },
	email:        { type: String, required: '{PATH} is required.', unique: true },
	password:     { type: String, required: '{PATH} is required.' },
	data:         Object,
    // {testName, solutions, studentAnswers
}));

module.exports.User = User;
