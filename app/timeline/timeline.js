/* Controllers */
app.controller('TimelineController', ['$scope', 'UserService', 'CalendarService', function ($scope, user, calendar) {
    console.log('TimelineController');

    // initial setup
    var daySize     = 31;
    $scope.cellSize = 31;
    $scope.year     = calendar.getYear();
    // $scope.period   = calendar.monthAsDays();
    $scope.period   = calendar.monthsAsDays();

    $scope.months   = calendar.getMonths();

    var nbDays = 0;
    for (var i = 0; i < $scope.period.length; i++) {
    nbDays += $scope.period[i].days.length;
    };

    $scope.daysContainerWidth = $scope.cellSize * nbDays;
    // $scope.users    = user.getUsers();
    var usersPromise = user.getUsers();
    usersPromise.then(function(users) {  // this is only run after $http completes
       $scope.users = users;
       // console.log("users " + $scope.users);
       // console.log('get tasks for users');
       //get tasks
       for (var i = $scope.users.length - 1; i >= 0; i--) {
            $scope.users[i].tasks = [];
            tasksPromises = user.getUserTasks($scope.users[i].id, $scope.period);
            tasksPromises.then(function(tasks) {
                //find the place to put
                if (tasks.length > 0) {
                    var idList = tasks[0].idList;
                    for (var j = $scope.users.length - 1; j >= 0; j--) {
                        if ($scope.users[j].id == idList) {
                            $scope.users[j].tasks = tasks;
                            break;
                        }
                    };
                };
                // console.log(tasks);
            });
       };
    });

    $scope.next = function() {
      calendar.next('month');
      updateView();
    };

    $scope.setMonth = function(month) {
      calendar.setMonth(month);
      updateView();
    };

    $scope.prev = function() {
      calendar.prev('month');
      updateView();
    };

    $scope.reset = function() {
      calendar.reset();
      updateView();
    };

    updateView = function() {
      $scope.year   = calendar.getYear();
      $scope.period = calendar.monthsAsDays();
      $scope.months = calendar.getMonths();
      var nbDays = 0;
      for (var i = 0; i < $scope.period.length; i++) {
        nbDays += $scope.period[i].days.length;
      };

      $scope.daysContainerWidth = $scope.cellSize * nbDays;

      // try to scroll to current offset
      setTimeout(function() {
        $('div.calendar-viewport').animate({
          scrollLeft: 870
        }, 500);
      }, 500)
    };

}]);
