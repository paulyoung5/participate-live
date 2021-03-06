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
    Auth0Strategy = require('passport-auth0'),
    io = require('socket.io')(http),
    mongoose = require('mongoose');

// Connect to the database
var dbOptions = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

mongoose.connect(process.env.MONGODB_URI, dbOptions);

var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));

// Once we've connected to the database
conn.once('open', function() {

      // Set the port (default is 5000)
      var port = process.env.PORT || 5000;

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

      // Include routes
      app.use('/', require('./controllers/index'));
      app.use('/host', require('./controllers/host'));
      app.use('/room', require('./controllers/room'));

      app.use('*', function(req, res, next) {
          var err = new Error();
          err.status = 404;
          next(err);
      });

      if(app.get('env') === 'development') {

          app.use(function(err, req, res, next) {

              console.log(err);

                res.status(err.status || 500);
                res.render('pages/error', {
                    message: err.message || 'The page you were looking for could not be found.',
                    error: err,
                    pageTitle: 'An error occured'
                });
            });

      }

      app.use(function(err, req, res, next) {
            res.status(err.status || 500);

            res.render('pages/error', {
                message: 'Something went wrong. Sorry about that.',
                error: {
                    title: 'Something went wrong'
                },
                pageTitle: 'An error occured'
            });

            console.log('Error: ', err);

        });

        io.on('connection', function(socket) {

          socket.on('join room', function(room) {

              socket.join(room);

              socket.room = room;

              /*io.to(socket.id).emit('initial data', {

                  Send initial data to the client.
                     We need to know:
                     -- If the activity is in progress
                     -- If it has, provide:
                        -- Activity type
                            -- If poll, provide title and available answers
                            -- If whiteboard, enable the Whiteboard
                            -- If open Q&A, enable open Q&A



              });*/

                io.sockets.in(room).emit('update data', {

                    participants: (io.sockets.adapter.rooms[room].length - 1)

                });

            });

            socket.on('poll vote', function(i) {

                socket.broadcast.to(socket.room).emit('poll vote', i);

            });

            socket.on('update data', function(data) {

                socket.broadcast.to(socket.room).emit('update data', data);

            });


            socket.on('canvas draw', function(data) {

                socket.broadcast.to(socket.room).emit('canvas draw', data);

            });

            socket.on('canvas clear', function() {

                socket.broadcast.to(socket.room).emit('canvas clear');

            });

            socket.on('canvas point', function(data) {

                socket.broadcast.to(socket.room).emit('canvas point', data);

            });

            socket.on('room tab change', function(data) {

                socket.broadcast.to(socket.room).emit('room tab change', data);

            });


            socket.on('new response', function(response) {

                socket.broadcast.to(socket.room).emit('new response', response);

            });


            socket.on('start poll', function() {

                socket.broadcast.to(socket.room).emit('start poll');

            });

            socket.on('stop poll', function() {

                socket.broadcast.to(socket.room).emit('stop poll');

            });


            socket.on('disconnect', function() {

                var room = socket.room;

                if(io.sockets.adapter.rooms[room]) {

                    io.sockets.in(room).emit('update data', {

                        participants: io.sockets.adapter.rooms[room].length - 1

                    });

                }

            });

        });

      http.listen(port, '0.0.0.0', function() {
        console.log('Node app is running on port '+port);
      });

});
