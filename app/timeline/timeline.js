/*
 * Timeline Controller
 *
 * TODO:
 * - don't fetch cards from trello on every switch just once and figure out how
 *   to fit them to current view.
 */
app.controller('TimelineController', ['$scope', 'UserService', 'CalendarService', 'promiseTracker', function ($scope, user, calendar, promiseTracker) {

    // initial setup
    $scope.cellSize       = 31;
    $scope.loadingTracker = promiseTracker();

    // fill in the content with users and tasks from trello
    user.fillUsersWithTasks($scope);
    // render calendar
    calendar.renderCalendar($scope);

    // assign avatars to view
    $scope.avatars = user.avatars;

    $scope.next = function() {
      calendar.next('month');
      user.fillUsersWithTasks($scope);
      calendar.renderCalendar($scope);
    };

    $scope.prev = function() {
      calendar.prev('month');
      user.fillUsersWithTasks($scope);
      calendar.renderCalendar($scope);
    };

    $scope.reset = function() {
      calendar.reset();
      user.fillUsersWithTasks($scope);
      calendar.renderCalendar($scope);
    };

    $scope.setMonth = function(month) {
        calendar.setMonth(month);
        user.fillUsersWithTasks($scope);
        calendar.renderCalendar($scope);
    };
}]);
