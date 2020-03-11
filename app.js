const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const session = require('express-session');
require('./mongo/db.js');

app.engine('ejs', require('ejs-locals'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	genid: (req) => {
		return require('crypto').randomBytes(48).toString('hex');
	},
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 60*60*1000*24
	}	
}));
app.use(serveStatic(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	if(req.session.user) {
		res.render('mainAuth', {title: req.session.name, name: req.session.name});
		console.log(req.session);
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
	const User = require('./mongo/models/user');
	User.create(user, (err, newUser) => {
		if(err) {
			console.log(err);
			return res.json({error: true});
		} else {
			req.session.user = user.login;
			req.session.name = user.name;
			console.log(req.session);
			return res.json(user);
		}		
	});
});

app.listen(3000, () => {
	console.log('Server is started on port 3000');
});