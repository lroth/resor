// Trello resources board id
var resourcesBoardId = 'lX34SxNJ';


Trello.authorize({
    interactive:true
});

//start the main app
var app = angular.module('app', ['ngRoute', 'calendar', 'user']);

/* Routing */
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/timeline', {
        templateUrl: 'app/timeline/index.html',
        controller: 'TimelineController'
      }).
      when('/activity', {
        templateUrl: 'app/activity/index.html',
        controller: 'ActivityController'
      }).
      otherwise({
        redirectTo: '/timeline'
      });
  }
]);
