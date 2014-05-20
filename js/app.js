// Trello resources board id
var resourcesBoardId = 'lX34SxNJ';

Trello.authorize({
    interactive:false
});

// main app
var app = angular.module('app', ['ngDialog']);

app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });

// UserService
app.factory('user', function($q) {
  var user = {
      users: [
        {
          id: 1,
          name: 'Lukasz Roth',
          "tasks": [
            {
              "id": "308484",
              "name": "urlop",
              "user_id": "18151",
              "project_id": "32884",
              "block_start_date": "2014-04-21",
              "block_start_doy": "111",
              "block_end_doy": "115",
              "block_end_date": "2014-04-25",
              "block_len": "4",
              "hours_pd": "8.0",
              "total_hours": "72.0",
              "project_name": "Personal Time Off"
            }
          ]
        },
        {id: 2, "tasks": [], name: 'Michał Soczyński'},
        {id: 3, "tasks": [], name: 'Krzysztof Proszkiewicz'},
        {id: 4, "tasks": [], name: 'Adam Misiorny'},
        {id: 5, "tasks": [], name: 'Radek Szczepaniak'},
        {id: 6, "tasks": [], name: 'Leszek Pawlak'},
        {id: 7, "tasks": [], name: 'Marek Murawski'}
      ],

      getUsers: function() {
        var deferred = $q.defer();

        Trello.get("boards/" + resourcesBoardId + "/lists", function(results) {
            deferred.resolve(results);
        });

        return deferred.promise;

        // return this.users;
      },

      getUserTasks: function(listId) {
            var deferred = $q.defer();

            Trello.get("lists/" + listId + "/cards", function(cards) {
                for (var i = cards.length - 1; i >= 0; i--) {
                    cards[i].block_start_doy = moment(cards[i].desc, "DD-MM-YYYY").dayOfYear();
                    cards[i].block_len       = moment(cards[i].due).dayOfYear() - cards[i].block_start_doy;
                };
                deferred.resolve(cards);
            });

            return deferred.promise;
      },

      getUserById: function(id) {
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].id == id) return this.users[i];
        };

        return null;
      }
  }

  return user;
});

// MenuService
app.factory('calendar', function() {
    var calendar = {
        current: moment(),
        toString: function() {
          return this.current.format("dddd, MMMM Do YYYY, h:mm:ss a");
        },
        getDay: function() {
            return this.current.format("DD");
        },
        getYear: function() {
            return this.current.format("YYYY")
        },
        getMonth: function() {
            return this.current.format("MM");
        },
        getMonths: function() {
          var months = [];
          for (var i = 0; i < 12; i++) {
            months.push({
              nb: i,
              shortName: moment().month(i).format('MMM'),
              current: this.current.month() == i
            });
          };

          return months;
        },
        monthAsDays: function() {
            var days = [];
            for (var i = 1; i <= this.current.daysInMonth(); i++) {
              days.push({
                nb: i,
                shortName: this.current.date(i).format("dd"),
                current: moment().isSame(this.current, 'day'),
                weekend: (this.current.weekday() == 6 || this.current.weekday() == 0),
                ofYear: this.current.dayOfYear(),
                date: this.current.format('YYYY-MM-DD')
              });
            };

            return days;
        },
        setMonth: function(month) {
          this.current.month(month);
        },
        next: function(period) {
          this.current.add(period, 1);

          return this;
        },
        prev: function(period) {
          this.current.subtract(period, 1);

          return this;
        },
        reset: function() {
          this.current = moment();

          return this;
        }
    }

    return calendar;
});

// Controller
app.controller('CalendarCtrl', function($scope, calendar, user, ngDialog) {

  // initial setup
  var daySize     = 31;
  $scope.cellSize = 31;
  $scope.year     = calendar.getYear();
  $scope.period   = calendar.monthAsDays();
  $scope.months   = calendar.getMonths();
  $scope.daysContainerWidth = $scope.cellSize * calendar.monthAsDays().length;
  // $scope.users    = user.getUsers();
  var usersPromise = user.getUsers();
  usersPromise.then(function(users) {  // this is only run after $http completes
       $scope.users = users;
       // console.log("users " + $scope.users);
       // console.log('get tasks for users');
       //get tasks
       for (var i = $scope.users.length - 1; i >= 0; i--) {
            $scope.users[i].tasks = [];

            tasksPromises = user.getUserTasks($scope.users[i].id);
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
      $scope.period = calendar.monthAsDays();
      $scope.months = calendar.getMonths();
      $scope.daysContainerWidth = daySize * calendar.monthAsDays().length;
  };

});
