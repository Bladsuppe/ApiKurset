var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', ['$scope', '$http', function ($scope, $http) {

        $scope.apiBaseUrl = "http://api.openweathermap.org/data/2.5/box/city?cluster=yes&bbox=";
        $scope.apiUrl = "";

        $scope.coordinates = {
            'europe':'-24,36,43,72',
            'usa':'-169,12,-52,70'
        }

        $scope.apiCache = {};
        $scope.searchResults = [];
        $scope.cachedResults;

        $scope.apiForcastBaseUrl ="http://api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=10&mode=json"
        $scope.apiForcastUrl ="";

        $scope.testCity = "id:1851632";
        $scope.searchResultForcastJson = '';
        $scope.forcastSearchResult = [];

        $scope.renderView = function(){
            $scope.searchResults = [];
            if ($scope.cachedResults!=null){
                var len = $scope.cachedResults.cnt;
                while (len--){
                    if (len==1){
                        console.log("Rendering " + $scope.cachedResults.cnt + " results of format:");
                        console.log($scope.cachedResults.list[len]);
                    }
                    $scope.searchResults.push($scope.cachedResults.list[len]);
                }
            }
            else{
                console.log("No results");
            }
        }

        $scope.search = function(searchQuery) {

            $scope.cachedResults = $scope.apiCache[searchQuery.location];

            if ($scope.cachedResults==null && $scope.coordinates[searchQuery.location]!=null){
                $scope.apiUrl = $scope.apiBaseUrl + $scope.coordinates[searchQuery.location];
                console.log("Call api " + $scope.apiUrl);
                responsePromise = $http.get($scope.apiUrl)
                    .success(function(data, status, headers, config) {
                        console.log('Cache results from api ' + $scope.apiUrl);
                        $scope.cachedResults = data;
                        $scope.apiCache[searchQuery.location] = $scope.cachedResults;
                        $scope.renderView();
                    })
                    .error(function(data, status, headers, config) {
                        alert("Calling API failed! " + status);
                    });
            }

            if ($scope.cachedResults!=null){
                console.log("Get searchResults from cache.");
                $scope.renderView();
            }


                /*
                 $scope.apiForcastUrl = $scope.apiForcastBaseUrl + $scope.searchCoords;
                 console.log('Calling remote url ' + $scope.apiForecastUrl + ' to fetch json....')
                 var responsePromise = $http.get($scope.apiForcastUrl);

                 responsePromise.success(function(data, status, headers, config) {
                 $scope.searchResultForcastJson = data;

                 var len = $scope.searchResultForcastJson.cnt;
                 while (len--){
                 $scope.forcastSearchResult.push($scope.searchResultForcastJson.list[len]);
                 }
                 });

                 responsePromise.error(function(data, status, headers, config) {
                 alert("Calling API failed! " + status);
                 });*/
            };

        }]);