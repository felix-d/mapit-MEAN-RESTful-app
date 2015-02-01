var routing = angular.module('myApp.routing', []);

routing.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/sign-up', {
        templateUrl: 'partials/sign-up.html',
        controller: 'SignUpCtrl'
      }).
      when('/panel', {
        templateUrl: 'partials/panel.html',
        controller: 'PanelCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

