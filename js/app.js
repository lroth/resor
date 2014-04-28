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
app.factory('user', function() {
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
        return this.users;
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
  // var daySize   = 31;
  $scope.cellSize = 31;
  $scope.year   = calendar.getYear();
  $scope.period = calendar.monthAsDays();
  $scope.months = calendar.getMonths();
  $scope.daysContainerWidth = $scope.cellSize * calendar.monthAsDays().length;
  $scope.users  = user.getUsers();

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

  $scope.edit = function(task_id) {
      console.log(task_id);
      //prepare task
      var task = {
          "block_start_date": "2014-04-21"
      }
      $scope.task = task;

      ngDialog.open({ template: 'newTask', scope: $scope });
  };

  $scope.create = function() {
      var u = user.getUserById(this.task.user_id);
      console.log(this.task);
      this.task.block_len = 3;
      u.tasks.push(this.task);
      ngDialog.close();
  };

  $scope.new = function(doy, user_id, year, date) {
    //prepare task
    var task = {
        "user_id": user_id,
        "block_start_date": date,
        "block_start_doy": doy,
    }
    $scope.task = task;

    ngDialog.open({ template: 'newTask', scope: $scope });
  };

  updateView = function() {
      $scope.year   = calendar.getYear();
      $scope.period = calendar.monthAsDays();
      $scope.months = calendar.getMonths();
      $scope.daysContainerWidth = daySize * calendar.monthAsDays().length;
  };

});
