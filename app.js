const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const serveStatic = require('serve-static');

app.engine('ejs', require('ejs-locals'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(serveStatic(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render('main');
});

app.listen(3000, () => {
	console.log('Server is started on port 3000');
});