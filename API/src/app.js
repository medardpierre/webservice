// Config
var express = require("express"),
bodyParser = require('body-parser'),
app = express(),
mongoose = require('mongoose'),
cors = require('cors');

app.use(cors());

// Receive post variable
app.use(bodyParser.json());

// Mongodb config
mongoose.connect('mongodb://localhost/test');

// Controllers
User = require('./controllers/user.js');

// Routes
app.get('/', function(req, res) { res.end("Welcome to the API"); });

app.post('/users', User.createUser);
//app.get('/users', User.getAllUsers);
app.get('/users/token/:token', User.getActualUser);
app.get('/users/:id', User.getUserById);
app.get('/users/mail/:email', User.getUserByEmail);
app.get('/users/name/:name', User.getUserByName);
app.put('/users/token/:token', User.editActualUser);
app.put('/users/:id', User.editUser);
app.post('/users/connect', User.connect);
app.post('/users/disconnect', User.disconnect);

app.listen(4242);
