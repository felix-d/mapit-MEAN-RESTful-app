var panelCtrl = angular.module('myApp.panelCtrl', []);
panelCtrl.controller('PanelCtrl', function($scope, $rootScope, $location, $http, AuthenticationService, GoogleMapService) {

    //The scope logout function
    $scope.logout = function() {

        //we clear the credentials from storage
        AuthenticationService.ClearCredentials();

        //we relocate to login page
        $location.path('/');
    };

    //Called when adding a message to the map
    $scope.sendMessage = function() {
        
        //we hide the error message if there was one
        $scope.showErrorMessage = false;

        //We need to set a marker!
        if (!GoogleMapService.isMarkerSet()) {
            $scope.errorMessage = "Please set a marker first";
            $scope.showErrorMessage = true;
        } 
        else {

            //we post to the api
            $http.post('/api/locations', {
                message: $scope.message,
                longitude: GoogleMapService.getLocation().longitude,
                latitude: GoogleMapService.getLocation().latitude
            }).success(function(response) {
                $scope.message = "";
                $scope.successMessage = "You mapped it!";
                $scope.showSuccessMessage = true;
                GoogleMapService.refreshLocations();
            });
        }
    };

    //scope function to delete a marker
    $scope.deleteMessage = function() {

        //we get the location object
        var csm = GoogleMapService.getSelectedLocation();

        //we delete it using its id
        $http.delete('/api/locations/' + csm.id).success(function(){
            $scope.successMessage = "Deleted!";
            $scope.showSuccessMessage = true;
            GoogleMapService.refreshLocations();
        });
    };

    //listen for allow event
    $rootScope.$on('allow', function() {
        $scope.$apply(function(){
           $scope.showDeleteButton = true;
 
        });
    });

    //listen for disallow event
    $rootScope.$on('disallow', function(){
        $scope.$apply(function(){
           $scope.showDeleteButton = false;
 
        });
        
    });

    //listen for hideAllMessages event
    $rootScope.$on('hideAllMessages', function(){
        $scope.$apply(function(){
           $scope.showErrorMessage = false;
           $scope.showSuccessMessage = false;
 
        });

    });

});
