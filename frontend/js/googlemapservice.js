angular.module('myApp.googleMapService', [])
    .factory('GoogleMapService', function($rootScope, $timeout, $http) {

        //The service our factory will return
        var googleMapService = {},

            //The last marker that was placed on the map
            //by the user
            lastMarker,

            //Array of the locations obtained from api call
            locations = [],

            //The current selected marker
            currentSelectedMarker;

        /***************************
         * Refresh the locations
         **************************/
        googleMapService.refreshLocations = function() {

            //we clear the array holding the api response 
            locations = [];

            //Ajax call
            $http.get('api/locations').success(function(response) {
                locations = responseToLocations(response);

                //We initialize the map
                initialize();

                //We remove last marker placed on the map
                if (lastMarker) lastMarker.setMap(null);
            }).error(function() {});
        };

        /***************************
         * Returns the position of the marker placed
         * on the map
         **************************/
        googleMapService.getLocation = function() {
            return {
                longitude: lastMarker.getPosition().lng(),
                latitude: lastMarker.getPosition().lat()
            };
        };

        /***************************
         * Returns true if marker was placed on the map
         **************************/
        googleMapService.isMarkerSet = function() {
            if (lastMarker === undefined) return false;
            else return true;
        };

        /***************************
         * Returns the current selected marker
         **************************/
        googleMapService.getSelectedLocation = function() {
            return currentSelectedMarker;
        };

        /***************************
         * Delete the last marker set on the map
         **************************/
        googleMapService.clearMarker = function() {
            if (lastMarker)
                lastMarker.setMap(null);
        };

        /***************************
         * The Location object
         **************************/
        function Location(latlon, message, username, id) {
            this.latlon = latlon;
            this.message = message;
            this.username = username;
            this.id = id;
        }

        /***************************
         * Convert the json response to
         * an array of Location objects
         **************************/
        function responseToLocations(response) {

            var locations = [];

            //We push into our locations array
            for (var i = 0, l = response.length; i < l; i++) {

                var r = response[i];

                //The message we'll put in the infowindow
                var contentString = '<div class="info-box"><h5>' +
                    r.username +
                    ' said:</h5><p>' +
                    r.message +
                    '</p><br/></div>';

                //add to the locations
                locations.push(new Location(
                    new google.maps.LatLng(r.latitude, r.longitude),
                    new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    r.username,
                    r._id
                ));
            }
            return locations;
        }

        /***************************
         * Set a marker on the map
         **************************/
        function setMarker(position, map) {
            var marker = new google.maps.Marker({
                position: position,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
            googleMapService.clearMarker();
            lastMarker = marker;
            map.panTo(position);
        }

        /***************************
         * Get the bounds from an array
         * of locations
         **************************/
        function getBounds(locations) {
            var latlngbounds = new google.maps.LatLngBounds();
            locations.forEach(function(n) {
                latlngbounds.extend(n.latlon);
            });
            return latlngbounds;
        }

        /***************************
         *  Remove from the map all the markers from
         *  an array of markers
         **************************/
        function clearMarkers(markers) {
            markers.forEach(function(m) {
                m.setMap(null);
            });
            return [];
        }

        /***************************
         * Initialize the Google Map
         **************************/
        function initialize() {

            //We create a cache
            if (!arguments.callee.cache) arguments.callee.cache = {};
            var cache = arguments.callee.cache;

            //If there are markers in the cache we clear them.
            if (cache.markers) cache.markers = clearMarkers(cache.markers);

            //else we cache an empty array
            else cache.markers = [];

            //If it's the first time we run the function
            if (cache.firstInit === undefined) {

                //We now have ran it 
                cache.firstInit = true;

                var mapOptions = {},
                    bounds,
                    fitBounds = false;

                //If we have markers to show
                if (locations.length !== 0) {
                    bounds = getBounds(locations);
                    fitBounds = true;
                }
                //Else we center on Montreal
                else {
                    mapOptions.center = new google.maps.LatLng(45.5, -73.5667);
                    mapOptions.zoom = 2;
                }

                //the new map
                cache.map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);

                //We set the map to fit the bounds if
                //there are markers
                if (fitBounds) cache.map.fitBounds(bounds);
            }

            //we add the markers to the map and set the listeners
            locations.forEach(function(n, i) {

                //Inner function to check if the user is the same as the user
                //that added the current marker
                function sameUser() {
                    var username = $rootScope.getUsername();
                    return username && n.username === username;
                }

                //We set the color to blue is same user
                var icon =
                    sameUser() ?
                    'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' :
                    'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

                //We create a marker
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: cache.map,
                    title: "none",
                    icon: icon
                });

                //We add it to the cache
                cache.markers.push(marker);

                //When we click on a maker
                google.maps.event.addListener(marker, 'click', function(e) {

                    //If owned by the user, allow deletion
                    if (sameUser()) $rootScope.$broadcast("allow");

                    //Else disallow
                    else $rootScope.$broadcast("disallow");

                    //We clear the marker set on the map
                    googleMapService.clearMarker();

                    //the current selected marker
                    currentSelectedMarker = n;

                    //we open the message
                    n.message.open(cache.map, marker);

                    //we hide all alert messages
                    $rootScope.$broadcast("hideAllMessages");
                });
            });

            //when we click on the map
            google.maps.event.addListener(cache.map, 'click', function(e) {

                //we disallow deleting
                $rootScope.$broadcast("disallow");

                //we hide all alert messages
                $rootScope.$broadcast("hideAllMessages");

                //If we are logged in, we can set markers on the map
                if ($rootScope.loggedIn()) setMarker(e.latLng, cache.map);
            });
        }

        //we show the map for the first time on page load
        google.maps.event.addDomListener(window, 'load',
            googleMapService.refreshLocations);

        return googleMapService;
    });
