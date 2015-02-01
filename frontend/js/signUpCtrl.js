var signUpCtrl = angular.module('myApp.signUpCtrl', []);
signUpCtrl.controller('SignUpCtrl', function($scope, $rootScope, $location, AuthenticationService){
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.signUp = function () {
            $scope.dataLoading = true;
            AuthenticationService.SignUp($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/panel');
                } else {
                    $scope.error = response.message;
                    console.log("not success");
                    $scope.dataLoading = false;
                }
            });
        };
});
