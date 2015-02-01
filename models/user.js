// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Simply put, middleware are functions that handle requests. A server created by
// connect.createServer can have a stack of middleware associated with it. When a
// request comes in, it is passed off to the first middleware function, along with
// a wrapped ServerResponse object and a next callback. Each middleware can decide
// to respond by calling methods on the response object, and/or pass the request
// off to the next layer in the stack by calling next(). 
//
// Execute before each user.save() call
// PRE REGISTERS A HOOK
UserSchema.pre('save', function(next) {
  var user = this;

  // Break out if the password hasn't changed
  // we call the next middleware
  // if a next is called with an error
  // The flow is interrupted
  if (!user.isModified('password')) return next();

  // Password changed so we need to hash it
  // first argument is number of rounds
  // err details errors
  // salt is the generated salt
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    
    // ORIGINALLY
    // bcrypt.hash(user.password, salt, null, function(err, hash) {
    // null is a callback to signify progress, we dont need it
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//We compare the passwords
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);

