const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	login: {
		type: String,
		require: true,
		unique: true
	},
	mail: {
		type: String,
		require: true,
	},
	hashedPassword: String
});

const User = mongoose.model('user', userSchema);
module.exports = User;