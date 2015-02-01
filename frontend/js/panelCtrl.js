var panelCtrl = angular.module('myApp.panelCtrl', []);
panelCtrl.controller('PanelCtrl', function($scope, $rootScope, $location, $http, AuthenticationService, GoogleMapService) {
    $scope.errorMessage = false;
    $scope.logout = function() {
        AuthenticationService.ClearCredentials();
        $location.path('/');
    };

    $scope.sendMessage = function() {
        $scope.showErrorMessage = false;
        if (!GoogleMapService.isMarkerSet()) {
            $scope.errorMessage = "Please set a marker first";
            $scope.showErrorMessage = true;
        } else {
            $http.post('/api/locations', {
                message: $scope.message,
                longitude: GoogleMapService.getLocation().longitude,
                latitude: GoogleMapService.getLocation().latitude
            }).success(function(response) {
                $scope.message = "";
                $scope.successMessage = "You mapped it!";
                $scope.showSuccessMessage = true;
                GoogleMapService.refreshLocations();

            }).error(function(response) {
                alert(response);
            });

        }
    };

    $scope.deleteMessage = function() {
        var csm = GoogleMapService.getSelectedLocation();
        $http.delete('/api/locations/' + csm.id).success(function(){
            $scope.successMessage = "Deleted!";
            $scope.showSuccessMessage = true;
            GoogleMapService.refreshLocations();
        });
    };

    $rootScope.$on('allow', function() {
        $scope.$apply(function(){
           $scope.showDeleteButton = true;
 
        });
    });

    $rootScope.$on('disallow', function(){
        $scope.$apply(function(){
           $scope.showDeleteButton = false;
 
        });
        
    });
    $rootScope.$on('hideAllMessages', function(){
        $scope.$apply(function(){
           $scope.showErrorMessage = false;
           $scope.showSuccessMessage = false;
 
        });

    });

});
