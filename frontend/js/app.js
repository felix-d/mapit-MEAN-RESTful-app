var app = angular.module('myApp', [
    'ngRoute',
    'ngCookies',
    'myApp.routing',
    'myApp.authenticationService',
    'myApp.panelCtrl',
    'myApp.loginCtrl',
    'myApp.signUpCtrl',
    'myApp.googleMapService'
])
    .run(function($http, $rootScope, $location, $cookieStore, AuthenticationService) {

        //on regarde si le user est logged
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        
        //quand la location change 
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in
            if (($location.path() !== '/login' && $location.path() !== '/sign-up') && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    });

app.controller('MyCtrl', function($scope) {

    $scope.name = 'World';
});
