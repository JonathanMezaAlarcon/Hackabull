var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'root',
	password : 'Password12345',
	database : 'nodelogin'
});

var app = express ();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var sql = "INSERT INTO accounts (username, firstname, lastname, password) VALUES ('emilyylin17@gmail.com', 'Emily, 'Lin', 'Password12345')"; 

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/signin.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
        console.log("username: " + username);
        console.log(password);
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/assignments.html'));
	} else {
		response.send('Invalid Credentials!');
	}
	response.end();
});

app.listen(3000);

