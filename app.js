const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config/config');
require('./mongo/db.js');
const User = require('./mongo/models/user');

app.engine('ejs', require('ejs-locals'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: false}));
config.session.genid = (req) => {
	return require('crypto').randomBytes(32).toString('hex');
};
app.use(session(config.session));
app.use(serveStatic(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	if(req.session.user) {
		User.findOne({login: req.session.user.login},(err, result) => {
			if(err) {
				console.log(err);
				res.status(500).send({
					error: "Database error: Fail to find user"
				});
			} 
			if(result === null) {
				req.session.user = null;
				res.render('main', {title: 'Palette'});
			} else {
				res.render('mainAuth', {title: req.session.user.name, name: req.session.user.name});
			}			
		});		
	} else {
		res.render('main', {title: 'Palette'});
	}	
});
app.post('/registration', (req, res) => {
	const user = {
		name: req.body.name,
		login: req.body.login,
		mail: req.body.mail,
		hashedPassword: req.body.password,
	};
	User.findOne({login: user.login}, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send({
				error: "Database error: Fail to find user"
			});
		}
		if(result !== null) {
			return res.status(400).send({
				error: "This login is alredy is use by another user"
			});
		} else {
			let user = new User();
			user.name = req.body.name;
			user.login = req.body.login;
			user.mail = req.body.mail;
			user.hashPassword(req.body.password);

			user.save((err, result) => {
				if(err) {
					console.log(err);
					res.status(500).send({
						error: "Database error: Fail to save user"
					});
				} else {
					req.session.user = {
						name: result.name,
						login: result.login,
						mail: result.mail
					};
					return res.status(201).send({
						message: 'User is registered'
					});
				}
			});
		}
	});
});
app.post('/login', (req, res) => {
	User.findOne({login: req.body.login}, (err, result) => {
		if(err) {
			console.log(err);
			res.status(500).send({
				error: "Database error: Fail to find user"
			});
		} 
		if(result === null) {
			return res.status(400).send({
				error: "Wrong login or password"
			});
		} 
		else if(result.checkPassword(req.body.password)) {
			req.session.user = {
				name: result.name,
				login: result.login,
				mail: result.mail
			};
			return res.status(201).send({
				message: 'User is login'
			});	
		} else {
			return res.status(400).send({
				error: "Wrong login or password"
			});
		}	
	})
});
app.post('/logout', (req, res) => {
	req.session.user = null;
	res.status(201).send({
		message: 'User is logout'
	});
});
app.post('/saveOpenedPalette', (req, res) => {
	req.session.paletteKey = req.body.paletteKey;
	res.status(201).send({
		message: 'Opened palette saved'
	});
});
app.post('/loadOpenedPalette', (req, res) => {
	if(req.session.paletteKey) {
		let paletteKey = req.session.paletteKey;
		return res.status(201).send({
			message: 'Opened palette loaded',
			paletteKey: paletteKey
		});
	}
	res.status(400).send({
		error: 'Palette does not exist'
	});
});
app.listen(config.server.port, () => {
	console.log(`Server is started on port ${config.server.port}`);
});