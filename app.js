'use strict';

// Load environment variables
require('dotenv').config({path: './vars.env'});

// Require all of the dependencies
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0');

// Set the port (default is 5000)
var port = process.env.PORT || 5000;

// Include our routes
var routes = require('./routes/index');

// Set up and use the authentication strategy
// Details are loaded from vars.env (more secure than hard coding them here)
passport.use(new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:'+ port + '/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile);
}));

// The searlize and deserialize user methods will allow us to get the user data once they are logged in.

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// All template files will be held in views
app.set('views', __dirname + '/views');
// Use EJS to render templates
app.set('view engine', 'ejs');

// The .use method also acts as a chain of events that will take place once a request hits our Node Js application. First we'll log the request data, parse any incoming data, and so on.


app.use(session({
  // Here we are creating a unique session identifier
  secret: 'som3s3cr3tp4sscode',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Make the 'public' folder available for access to assets
app.use(express.static(__dirname + '/public'));
// Similarly, files under /node_modules/ can be accessed by a pseudo directory 'scripts'
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });

});

http.listen(port, '0.0.0.0', function() {
  console.log('Node app is running on port '+port);
});
