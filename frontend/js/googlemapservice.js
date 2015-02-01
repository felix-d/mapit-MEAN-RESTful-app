angular.module('myApp.googleMapService', [])
    .factory('GoogleMapService', function($rootScope, $http) {

        var googleMapService = {},
            lastMarker,
            rawlocations = [],
            currentSelectedLocation;

        googleMapService.refreshLocations = function() {
            rawlocations = [];
            $http.get('api/locations').success(function(response) {
                for (var i = 0, l = response.length; i < l; i++) {
                    var r = response[i];
                    rawlocations.push([parseFloat(r.latitude), parseFloat(r.longitude), r.username, r.message, r._id]);
                }
                initialize();
                if (lastMarker) lastMarker.setMap(null);
            }).error(function() {});
        };


        //An object that will contain the google map latlong
        //and the google map infoWindow associated
        function Location(latlon, message, username, id) {
            this.latlon = latlon;
            this.message = message;
            this.username = username;
            this.id = id;
        }

        //Convert the raw data into an array of Location Objects
        function getLocations(locations) {
            return locations.map(function(e, i) {
                var contentString = '<div class="info-box"><h3>' + e[2] + ' said:</h3>' + e[3] + '</div>';
                return new Location(
                    new google.maps.LatLng(e[0], e[1]),
                    new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    e[2],
                    e[4]);

            });
        }

        googleMapService.getLocation = function() {
            return {
                longitude: lastMarker.getPosition().lng(),
                latitude: lastMarker.getPosition().lat()
            };
        };

        googleMapService.isMarkerSet = function() {
            if (lastMarker === undefined) return false;
            else return true;
        };
        //function to place marker when the user click
        function placeMarker(position, map) {
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


        //we get the bounds from an array of Location objects to
        //initialize the map
        function getBounds(locations) {
            var latlngbounds = new google.maps.LatLngBounds();
            locations.forEach(function(n) {
                latlngbounds.extend(n.latlon);
            });
            return latlngbounds;
        }

        function clearMarkers(markers){
            markers.forEach(function(m){
                m.setMap(null);
            });
            console.log("cleaning");
            return [];
        }

        function initialize() {
                if (!arguments.callee.cache) arguments.callee.cache = {};
                var cache = arguments.callee.cache;
                if(cache.markers) cache.markers = clearMarkers(cache.markers);
                else cache.markers = [];
                var locations = getLocations(rawlocations);
                if (cache.firstInit === undefined) {
                    cache.firstInit = true;
                    var mapOptions = {},
                        bounds;
                    if (rawlocations.length !== 0) {
                        bounds = getBounds(locations);

                    } else {
                        mapOptions.center = new google.maps.LatLng(45.5, -73.5667);
                        mapOptions.zoom = 2;
                    }
                    //the new map
                    cache.map = new google.maps.Map(document.getElementById('map-canvas'),
                        mapOptions);

                    if (rawlocations.length !== 0) map.fitBounds(bounds);
                }
                //we add the markers to the map and set the listeners
                locations.forEach(function(n, i) {
                    function sameUser() {
                        var username = $rootScope.getUsername();
                        return username && n.username === username;
                    }
                    var icon =
                        sameUser() ?
                        'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' :
                        'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

                    var marker = new google.maps.Marker({
                        position: n.latlon,
                        map: cache.map,
                        title: "none",
                        icon: icon
                    });
                    cache.markers.push(marker);

                    google.maps.event.addListener(marker, 'click', function(e) {
                        if (sameUser()) $rootScope.$broadcast("allow");
                        else $rootScope.$broadcast("disallow");
                        googleMapService.clearMarker();
                        currentSelectedLocation = n;
                        n.message.open(cache.map, marker);
                        $rootScope.$broadcast("hideAllMessages");
                    });
                });

                google.maps.event.addListener(cache.map, 'click', function(e) {
                    $rootScope.$broadcast("disallow");
                    $rootScope.$broadcast("hideAllMessages");
                    if ($rootScope.loggedIn()) placeMarker(e.latLng, cache.map);
                });
            }
            //we show the map
        googleMapService.refreshLocations();

        googleMapService.getSelectedLocation = function() {
            return currentSelectedLocation;
        };
        googleMapService.clearMarker = function() {
            if (lastMarker)
                lastMarker.setMap(null);
        };

        google.maps.event.addDomListener(window, 'load', initialize);
        return googleMapService;
    });
