var loginCtrl = angular.module('myApp.loginCtrl', []);
loginCtrl.controller('LoginCtrl',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('panel');
                } else {
                    $scope.error = response.message;
                    console.log("not success");
                    $scope.dataLoading = false;
                }
            });
        };
    }]);
