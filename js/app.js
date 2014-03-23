var app = angular.module('app', []);

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
        monthAsDays: function() {
            var days = [];
            for (var i = 1; i <= this.current.daysInMonth(); i++) {
              days.push({
                nb: i,
                shortName: this.current.date(i).format("dd"),
                month: this.current.format("MMM"),
                year: this.current.format("YYYY"),
                now: '' //today
              })
            };

            return days;
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
app.controller('CalendarCtrl', function($scope, calendar) {

  $scope.period = calendar.monthAsDays();

  $scope.next = function() {
      $scope.period = calendar.next('month').monthAsDays();
  };

  $scope.prev = function() {
      $scope.period = calendar.prev('month').monthAsDays();
  };

  $scope.reset = function() {
      $scope.period = calendar.reset().monthAsDays();
  };
});
