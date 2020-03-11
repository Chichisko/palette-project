const mongoose = require('mongoose');
const db = 'mongodb://localhost/palette'
mongoose.connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to ' + db);
});
mongoose.connection.on('error', (err) => {
	console.log('Mongoose fail connection: ' + err);
});
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});