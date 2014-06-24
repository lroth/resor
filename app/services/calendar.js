// Calendar service
angular.module('calendar', [])
    .service('CalendarService', [function(){
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
              current: this.current.month() - 1 == i
            });
          };

          return months;
        },

        // get three last months
        monthsAsDays: function() {
            var months = [];

            //get previous month
            this.prev('month');
            months.push({
              name: this.current.format("MMMM"),
              days: this.monthAsDays()
            });

            //get current month
            this.next('month');
            months.push({
              name: this.current.format("MMMM"),
              days: this.monthAsDays()
            });

            //get next month
            this.next('month');
            months.push({
              name: this.current.format("MMMM"),
              days: this.monthAsDays()
            });

            return months;
        },

        //fetch one month as days
        monthAsDays: function() {
            var days = [];
            for (var i = 1; i <= this.current.daysInMonth(); i++) {
              days.push({
                nb: i,
                shortName: this.current.date(i).format("dd"),
                current: moment().isSame(this.current, 'day'),
                weekend: (this.current.weekday() == 6 || this.current.weekday() == 0),
                ofYear: this.current.dayOfYear(),
                year: this.current.format('YYYY'),
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
        },

        renderCalendar: function($scope) {
            $scope.year   = this.getYear();
            $scope.period = this.monthsAsDays();
            $scope.months = this.getMonths();

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
            }, 500);
        }
    }
    return calendar;
}]);

