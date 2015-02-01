// We load the Location model
var Location = require('../models/location');
var User = require('../models/user');
var mongoose = require('../node_modules/mongoose');
// **********************************
// POST Locations
// **********************************
// Create endpoint /api/locations for POSTS
exports.postLocations = function(req, res) {
    // Create a new instance of the Location model
    var location = new Location();
    // Set the location properties that came from the POST data
    console.log(req.body.message);
    console.log(req.body.latitude);
    console.log(req.body.longitude);

    location.latitude = req.body.latitude;
    location.longitude = req.body.longitude;

    location.message = req.body.message;

    //passport will automatically set the user in req.user
    location.userId = req.user._id;

    // Save the location and check for errors
    location.save(function(err) {
        if (err){
            res.send(err);
            return;
        }

        res.json({
            success: 'Location added successfully',
            data: location
        });
    });
};

// **********************************
// GET Locations
// **********************************
// Create endpoint /api/locations for GET
exports.getLocations = function(req, res) {
    // Use the Location model to find all locations
    // from particular user with their username
    Location.find({}).lean().exec(function(err, locations) {
        if(err){
            res.send(err);
            return;
        }

        //We want to set the username on each location by looking
        //up the userId in the User documents.
        //
        //Because of mongoose asynchronism, we will have to wait
        //to get all the results from the queries on the User model
        //We can send them when we have iterated
        //through every location (counter === l)
        var counter = 0;
        var l = locations.length;

        //We create a closure to have access to the location
        var closure = function(location){

            return function(err, user){

                counter++;

                if(err)
                    res.send(err);

                location.username = user.username;

                //when all the users have been set
                if(counter === l ) {
                    //respond
                    res.json(locations);
                    return;
                }           
            };
        };

        //We iterate through all locations to find their associated
        //username.
        for (var i = 0; i < l; i++) {
            User.findById(locations[i].userId, closure(locations[i]));
        }
    });
};

// **********************************
// GET a Location
// **********************************
// Create endpoint /api/locations/:location_id for GET
exports.getLocation = function(req, res) {
    // Use the Location model to find a specific location
    console.log(req.user._id);
    Location.find({
        userId: req.user._id,
        _id: req.params.location_id
    }, function(err, location) {
        if (err)
            res.send(err);

        res.json(location);
    });
};

// **********************************
// UPDATE a Location
// **********************************
// Create endpoint /api/locations/:location_id for PUT
exports.putLocation = function(req, res) {
    // Use the Location model to find a specific location
    Location.update({
        userId: req.user._id,
        _id: req.params.location_id
    }, {
        message: req.body.message
    }, function(err, num, raw) {
        if (err)
            res.send(err);

        res.json({
            message: 'message updated'
        });
    });
};

// **********************************
// DELETE Location
// **********************************
// Create endpoint /api/locations/:location_id for DELETE
exports.deleteLocation = function(req, res) {
    // Use the Location model to find a specific location and remove it
    Location.remove({
        userId: req.user._id,
        _id: req.params.location_id
    }, function(err) {
        if (err)
            res.send(err);

        res.json({
            message: 'Location deleted'
        });
    });
};
