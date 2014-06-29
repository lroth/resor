/* Controllers */
app.controller('InvoicesController', ['$scope', '$http', function ($scope, $http) {
    //34bce29ef1468a651a0d900a25c0c22c622bcdb5 infakt api key

    var successCallback = function(results) {
        console.log(results);
    }

    var errorCallback = function(results) {
        console.log(results);
    }

    $http({
        method: 'GET',
        withCredentials: true,
        url: 'https://api.infakt.pl/v3/clients.json',
        headers: { 'X-inFakt-ApiKey': '34bce29ef1468a651a0d900a25c0c22c622bcdb5'}
    }).success(successCallback).error(errorCallback);

    console.log('InvoicesController');
}]);
