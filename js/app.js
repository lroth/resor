// main app
var app = angular.module('app', []);

// UserService
app.factory('user', function() {
  var user = {
      users: [
        {name: 'Lukasz Roth'},
        {name: 'Michał Soczyński'},
        {name: 'Krzysztof Proszkiewicz'},
        {name: 'Adam Misiorny'},
        {name: 'Radek Szczepaniak'},
        {name: 'Leszek Pawlak'},
        {name: 'Marek Murawski'}
      ],
      getUsers: function() {
        return this.users;
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
                weekend: (this.current.weekday() == 6 || this.current.weekday() == 0)
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
app.controller('CalendarCtrl', function($scope, calendar, user) {

  // initial setup
  var daySize   = 30;
  $scope.year   = calendar.getYear();
  $scope.period = calendar.monthAsDays();
  $scope.months = calendar.getMonths();
  $scope.daysContainerWidth = daySize * calendar.monthAsDays().length;
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

  updateView = function() {
      $scope.year   = calendar.getYear();
      $scope.period = calendar.monthAsDays();
      $scope.months = calendar.getMonths();
      $scope.daysContainerWidth = daySize * calendar.monthAsDays().length;
  };

});
