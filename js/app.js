// main app
var app = angular.module('app', []);

// UserService
app.factory('user', function() {
  var user = {
      users: [
        {
          name: 'Lukasz Roth',
          "tasks": [
          {
            "task_id": "308484",
            "task_name": "urlop",
            "people_id": "18151",
            "project_id": "32884",
            "client_name": null,
            "week_start_date": "2014-04-20",
            "creation_doy": "94",
            "start_date": "2014-04-22",
            "start_doy": "112",
            "start_yr": "2014",
            "end_date": "2014-05-02",
            "end_doy": "122",
            "block_start_date": "2014-04-22",
            "block_start_doy": "112",
            "block_end_doy": "115",
            "block_end_date": "2014-04-25",
            "block_len": "4",
            "hours_pd": "8.0",
            "total_hours": "72.0",
            "task_days": "9",
            "task_cal_days": "11",
            "created_by": "Lukasz Roth",
            "modified_by": "Lukasz Roth",
            "project_name": "Personal Time Off",
            "sked_admin": "true",
            "is_owner": "true",
            "priority": 0
          }
          ]
        },
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
  var daySize   = 31;
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
