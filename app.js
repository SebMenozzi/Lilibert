var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

/* CONFIG */
var port = process.env.PORT || 8080;
// just by security :)
app.disable('x-powered-by');

app.use(express.static(__dirname + '/app/public'));
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '100mb'}));
// use morgan to log requests to the console
app.use(morgan('dev'));

/* MODELS */
var User = require("./server/models/user.js");

/* API V1 */
var authApi = require('./server/routes/api/auth');
app.use('/api/auth',  authApi);

var blacklistApi = require('./server/routes/api/blacklist');
app.use('/api/blacklist',  blacklistApi);

var userApi = require('./server/routes/api/user');
app.use('/api/users',  userApi);

var quizzApi = require('./server/routes/api/quizz');
app.use('/api/quizzes',  quizzApi);

/* RENDERING */
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/app/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
