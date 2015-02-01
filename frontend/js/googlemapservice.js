angular.module('myApp.googleMapService', [])
    .factory('GoogleMapService', function($rootScope, $http) {

        var googleMapService = {},
            lastMarker,
            rawlocations = [];
       
        
        //We get the locations from a get request to the server
        rawlocations = [
            [45.5, 73.5, "Bob", "allo je mappelle Bob"],
            [45.56, 73.45, "Yolo", "wooow trop yolo serieux"],
            [45.33, 45.12, "Cath", "wudup i am cath"]
        ];

        $http.get('api/locations').success(function(response){
           console.log(JSON.stringify(response)); 
        });


        //An object that will contain the google map latlong
        //and the google map infoWindow associated
        function Location(latlon, message) {
            this.latlon = latlon;
            this.message = message;
        }

        //Convert the raw data into an array of Location Objects
        function getLocations(locations) {
            return locations.map(function(e, i) {
                var contentString = '<div>' + e[2] + ' said:<br/>' + e[3] + '</div>';
                return new Location(
                    new google.maps.LatLng(e[0], e[1]),
                    new google.maps.InfoWindow({
                        content: contentString
                    }));
            });
        }

        googleMapService.getLocation = function(){
            return {
                longitude: lastMarker.getPosition().lng(),
                latitude: lastMarker.getPosition().lat()
            };
        };
        //function to place marker when the user click
        function placeMarker(position, map) {
            var marker = new google.maps.Marker({
                position: position,
                map: map
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

        function addMarker() {
            var latitude = lastMarker.position.lat();
            var longitude = lastMarker.position.lon();

            ////we get the content
            //var message = theContent;

            ////we post the new location
            //$http

            //we clear the lastMarker so it cannot be removed on success
            lastMarker = undefined;
        }

        function initialize() {

                var locations = getLocations(rawlocations);

                //we get bounds
                theBounds = getBounds(locations);


                //we set map options
                var mapOptions = {
                    center: theBounds.getCenter()
                };

                //the new map
                var map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);

                //we fit bounds
                map.fitBounds(theBounds);

                //we add the markers to the map and set the listeners
                locations.forEach(function(n, i) {
                    var marker = new google.maps.Marker({
                        position: n.latlon,
                        map: map,
                        title: "none"
                    });
                    google.maps.event.addListener(marker, 'click', function(e) {
                        n.message.open(map, marker);
                    });
                });

                google.maps.event.addListener(map, 'click', function(e) {
                    if ($rootScope.loggedIn()) placeMarker(e.latLng, map);
                });
            }
            //we show the map
        google.maps.event.addDomListener(window, 'load', initialize);

        googleMapService.clearMarker = function() {
            if (lastMarker)
                lastMarker.setMap(null);
        };

        return googleMapService;
    });
