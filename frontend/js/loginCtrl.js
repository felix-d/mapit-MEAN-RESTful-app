var loginCtrl = angular.module('myApp.loginCtrl', []);
loginCtrl.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function($scope, $rootScope, $location, AuthenticationService) {

        // reset login status
        AuthenticationService.ClearCredentials();

        //the scope login function
        $scope.login = function() {

            //Show the spinner
            $scope.dataLoading = true;

            //Log the user with the service
            AuthenticationService.Login($scope.username, $scope.password,
                function(response) {
                    
                    if (response.success) {

                        //we set the credentials
                        AuthenticationService.SetCredentials($scope.username, $scope.password);

                        //we relocate to /panel
                        $location.path('panel');

                    } else {
                        
                        //we show an error
                        $scope.error = response.message;

                        $scope.dataLoading = false;
                    }
                });
        };
    }
]);
