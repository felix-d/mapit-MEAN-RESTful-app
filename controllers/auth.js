// Load required packages
var passport = require('passport');

//we require the basic strategy
//No challenge response schema, password is sent in the clear...
//should use HTTPS
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(
  function(username, password, next) {
    //We check if the supplied user exists
    User.findOne({ username: username }, function (err, user) {
      if (err) { return next(err); }

      // No user found with that username
      // no error, but we stop the call chain
      if (!user) { return next(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        //error
        if (err) { return next(err); }

        // Password did not match
        if (!isMatch) { return next(null, false); }

        // Success, we return the user to the next middleware
        return next(null, user);
      });
    });
  }
));


//we create a function named isAuthenticated
//we tell passport to use our basic strategy
//we set session to false to not store session variables
exports.isAuthenticated = passport.authenticate('basic', { session : false });

