const mongoose = require('mongoose');
const config = require('./../config/config');
mongoose.connect(config.mongo.uri, config.mongo.settings);

mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to ' + config.mongo.uri);
});
mongoose.connection.on('error', (err) => {
	console.log('Mongoose fail connection: ' + err);
});
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});