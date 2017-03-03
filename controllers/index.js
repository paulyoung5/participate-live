'use strict';

var express = require('express'),
    passport = require('passport'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn(),
    models = require('../models/index');

var router = express.Router();

router.get('/', function(req, res) {

  if(!req.isAuthenticated()) {
    res.render('pages/landing', {
      env: process.env,
      pageTitle: 'A realtime toolkit for any audience'
    });
  } else {
    res.redirect('/dashboard');
  }

});

router.get('/dashboard', ensureLoggedIn, function(req, res) {

    models.Room.findByUser(req.user.id).then(function(rooms) {

        res.render('pages/host/home', {
            env: JSON.stringify(process.env),
            pageTitle: 'Dashboard',
            rooms: JSON.stringify(rooms),
            user: JSON.stringify(req.user)
        });

    }).catch(function(err) {

        res.send('An error occured while trying to grab rooms: ', err);

    });

});

router.get('/settings', ensureLoggedIn, function(req, res) {
  res.render('pages/host/settings', {
      env: process.env,
      pageTitle: 'Settings',
      user: JSON.stringify(req.user)
  });
});

// We are going to do the same thing for the remaining routes.
router.get('/login',function(req, res){
  res.render('pages/login', {
    env: process.env,
    pageTitle: 'Log in'
  });
});

// Implement the callback route which will redirect the logged in user to the dashboard if authentication succeeds.
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/dashboard');
  });

  router.get('/logout', function(req, res){
    // For the logout page, we don't need to render a page, we just want the user to be logged out when they hit this page. We'll use the ExpressJS built in logout method, and then we'll redirect the user back to the homepage.
    req.logout();
    res.redirect('/');
  });

// Export this module so that we can import it in our app.js file and gain access to the routes we defined.
module.exports = router;
