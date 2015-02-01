// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

// //we import the controllers
var locationController = require('./controllers/location');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
 
// Connect to the mapit database
mongoose.connect('mongodb://felix:mapitadmin@ds039411.mongolab.com:39411/heroku_app33632584');

// Create our Express application
var app = express();

// Use the body-parser package in our application
// The "extended" syntax allows for rich objects and arrays to be encoded into
// the urlencoded format, allowing for a JSON-like experience with urlencoded.
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({
}));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

// app.get('/', function(req, res){
//  res.sendfile('index.html', {root: __dirname + '/frontend/' });
// });
app.use(express.static(__dirname + '/frontend/'));
// Create endpoint handlers for /locations
router.route('/locations')
  .post(authController.isAuthenticated, locationController.postLocations)
  .get(locationController.getLocations);

// Create endpoint handlers for /Locations/:Location_id
router.route('/locations/:location_id')
  .get(authController.isAuthenticated, locationController.getLocation)
  .put(authController.isAuthenticated, locationController.putLocation)
  .delete(authController.isAuthenticated, locationController.deleteLocation);

//Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/authenticate')
  .post(userController.authenticateUser);

// Register all our routes with /api
app.use('/api', router);

// Start the server

app.listen(process.env.PORT || 5000);
