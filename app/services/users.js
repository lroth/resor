// UserService
angular.module('user', [])
    .service('UserService', ['$q', function($q){
    var user = {
        users: [],

        getUsers: function() {
          var deferred = $q.defer();

          Trello.get("boards/" + resourcesBoardId + "/lists", function(results) {
              // remove projects inbox?
              deferred.resolve(results.splice(1, results.length));
          });

          return deferred.promise;

          // return this.users;
        },

        fitToView: function(cards, period) {
            var lowLimit  = moment(period[0]['days'][0].date, "YYYY-MM-DD");
            var highLimit = moment(period[period.length - 1]['days'][period[period.length - 1]['days'].length - 1].date, "YYYY-MM-DD");

            for (var i = cards.length - 1; i >= 0; i--) {

                var startDay = moment(cards[i].desc, "DD-MM-YYYY");
                var endDay   = moment(cards[i].due, "YYYY-MM-DD");

                //fix those data if task started before current period
                if (moment(startDay).isBefore(lowLimit)) {
                    startDay = lowLimit;
                };

                var length = endDay.dayOfYear() - startDay.dayOfYear();

                //fix length
                if (moment(endDay).isAfter(highLimit)) {
                    length = highLimit.dayOfYear() - startDay.dayOfYear();
                };

                cards[i].color = 'blue';

                if (cards[i].labels.length > 0) {
                    cards[i].color = cards[i].labels[0].color;
                };

                cards[i].year            = startDay.format("YYYY");
                cards[i].block_start_doy = startDay.dayOfYear();
                cards[i].block_len       = length + 1; //+1 to fill in the last day also
                cards[i].index           = i;
            };

            return cards;
        },

        getUserTasks: function(listId, period) {
              var deferred = $q.defer();
              var that      = this;

              Trello.get("lists/" + listId + "/cards", function(cards) {
                  // console.log(cards)
                  cards = that.fitToView(cards, period);

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
}]);

