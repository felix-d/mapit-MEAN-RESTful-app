// Load required packages
var User = require('../models/user');

// **********************************
// GET Users
// **********************************
// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);
    res.json(users);
  });
};

// **********************************
// POST Users
// **********************************
// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
    if(!req.body.username || !req.body.password){
        res.json({ message: 'Error processing the request' });
        return;
    }
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
      if (err){
      res.json({message: 'User might already exist'});
      return;
      }

    res.json({ success: 'New user added' });
  });
};

// **********************************
// Authenticate user
// **********************************
// Create endpoint /api/authenticate for POST
exports.authenticateUser = function(req, res) {
    if(!req.body.username || !req.body.password){
        res.json({ message: 'Error processing the request' });
        return;
    }
    User.findOne({username: req.body.username}, function(err, user){
        if(!user){
            res.json({message: 'User doesn\'t exists'});
            return;
        }
        user.verifyPassword(req.body.password, function(err, isMatch){
            if(err){
                res.json({message: err});
                return;
            } else if(!isMatch){
                res.json({message: "Wrong password."});
            } else {
                res.json({success: "authenticated!"});
            }
        });
    });
};

