// UserService
angular.module('user', [])
    .service('UserService', ['$q', function($q){
    var user = {
        avatars: {
          'Łukasz R.':    'https://trello-avatars.s3.amazonaws.com/52ef80658c6c7cff719466a11b1141eb/50.png',
          'Michał S.':    'https://trello-avatars.s3.amazonaws.com/d18adccfad7e99f73b87aaf578e3263a/50.png',
          'Krzysztof P.': 'https://trello-avatars.s3.amazonaws.com/c31fa91cc2eb86ec782573135fa7df2b/50.png',
          'Adam M.':      'https://trello-avatars.s3.amazonaws.com/310f7f4187df3217c26d7824cb80a06b/50.png',
          'Radek S.':     'UI/images/avatar.png?v2',
          'Leszek P.':    'https://trello-avatars.s3.amazonaws.com/d3ee1843504e8be964ec4ef740930b60/50.png',
          'Marek M.':     'https://trello-avatars.s3.amazonaws.com/879fe9a78134449d0105dc056ffa9e91/50.png'
        },

        users: [],

        fillUsersWithTasks: function($scope) {
          var userPromise = this.getUsers();
          $scope.loadingTracker.addPromise(userPromise);
          userPromise.then(function(users) {
              $scope.users = users;
              //get tasks for each user
              for (var i = $scope.users.length - 1; i >= 0; i--) {
                  $scope.users[i].tasks = [];
                  tasksPromises = user.getUserTasks($scope.users[i].id, $scope.period);
                  $scope.loadingTracker.addPromise(tasksPromises);
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
                  });
             };
          });
        },

        getUsers: function() {
          var deferred = $q.defer();

          Trello.get("boards/" + resourcesBoardId + "/lists", function(results) {
              // remove projects inbox?
              var tmp = results[0];
              var res = results.splice(1, results.length);
              res.push(tmp);
              deferred.resolve(res);
          });

          return deferred.promise;
        },

        fitToView: function(cards, period) {
            var lowLimit  = moment(period[0]['days'][0].date, "YYYY-MM-DD");
            var highLimit = moment(period[period.length - 1]['days'][period[period.length - 1]['days'].length - 1].date, "YYYY-MM-DD");

            for (var i = 0; i < cards.length; i++) {

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
                cards[i].block_end_doy   = startDay.dayOfYear() + cards[i].block_len;

                // increase index only if for this user previously we have something between those dates.
                var collisions = this.checkCollisions(cards, i);
                if (collisions) {
                    cards[i].index = collisions;
                };
            };

            return cards;
        },

        checkCollisions: function(cards, index) {
            var collisions = 0;
            for (var i = 0; i < index; i++) {
                //compare year
                if (
                    cards[index].year == cards[i].year &&
                    (
                      (cards[index].block_start_doy > cards[i].block_start_doy && cards[index].block_start_doy < cards[i].block_end_doy) ||
                      (cards[index].block_end_doy > cards[i].block_start_doy && cards[index].block_end_doy < cards[i].block_end_doy) ||
                      (cards[i].block_start_doy > cards[index].block_start_doy && cards[i].block_start_doy < cards[index].block_end_doy) ||
                      (cards[i].block_end_doy > cards[index].block_start_doy && cards[i].block_end_doy < cards[index].block_end_doy)
                    )
                  ) {

                    collisions++;
                };
            };

            return collisions;
        },

        getUserTasks: function(listId, period) {
              var deferred = $q.defer();
              var that      = this;

              Trello.get("lists/" + listId + "/cards", function(cards) {
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

