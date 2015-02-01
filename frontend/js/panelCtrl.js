var panelCtrl = angular.module('myApp.panelCtrl', []);
panelCtrl.controller('PanelCtrl', function($scope, $location, $http, AuthenticationService, GoogleMapService) {
    $scope.logout = function() {
        AuthenticationService.ClearCredentials();
        $location.path('/');
    };
    $scope.sendMessage = function() {
        $http.post('/api/locations', {
            message: $scope.message,
            longitude: GoogleMapService.getLocation().longitude,
            latitude: GoogleMapService.getLocation().latitude
        }).success(function(response){
            alert(response.success);
          
        }).error(function(response){
           alert("there was an error");
        });
    };

});
