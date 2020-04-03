const mongoose = require('mongoose');
const crypto = require('crypto');

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
	salt: String,
	hash: String
});

userSchema.methods.hashPassword = function(password) {
	this.salt = crypto.randomBytes(32).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 256, `sha512`).toString('hex');
}
userSchema.methods.checkPassword = function(password) {
	let salt = this.salt;
	let newHash = crypto.pbkdf2Sync(password, salt, 10000, 256, `sha512`).toString('hex');
	if(this.hash == newHash) {
		return true;
	} else {
		return false;
	}
}

const User = mongoose.model('user', userSchema);
module.exports = User;