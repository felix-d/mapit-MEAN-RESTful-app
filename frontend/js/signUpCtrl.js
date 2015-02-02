var signUpCtrl = angular.module('myApp.signUpCtrl', []);
signUpCtrl.controller('SignUpCtrl', function($scope, $rootScope, $location, AuthenticationService){

        // reset login status
        AuthenticationService.ClearCredentials();
        
        //scope sign up function
        $scope.signUp = function () {

            //show spinner
            $scope.dataLoading = true;

            //we call the sign up method
            AuthenticationService.SignUp($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/panel');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
});
