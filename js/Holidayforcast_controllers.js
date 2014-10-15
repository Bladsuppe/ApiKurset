var weatherApp = angular.module('weatherApp', []);

weatherApp.filter('weatherFilter',function(){
    return function(input,weathertype) {
        var returnedInputs = [];
        console.log("Filtering on " + weathertype);
        for (var i = 0; i < input.length; i++) {
            if (input[i].weather!=null && weathertype==input[i].weather[0].main || weathertype==null){
                returnedInputs.push(input[i]);
            }
        }
        return returnedInputs;
    };
});

weatherApp.controller('weatherController', ['$scope', '$http', function ($scope, $http) {

        $scope.apiBBoxBaseUrl = "http://api.openweathermap.org/data/2.5/box/city?cluster=yes&bbox=";
        $scope.apiForcastBaseUrl ="http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&cnt=14&id=";
        $scope.apiUrl = "";

        <!--Object that stores bounding-box coordinates for locations-->
        $scope.coordinates = {
            'europe':'-24,36,43,72',
            'usa':'-169,12,-52,70'
        }
        <!--Initialize empty apiCache to store json results from api-->
        $scope.apiLocationCache = {};

        <!--This is used to hold the cached results for one search-->
        $scope.cachedResults;

        <!--This is iterated in the searchResults table in the view-->
        $scope.searchResults = [];

        <!--This function iterates the cachedResults and pushes the entries to the searchResults table-->
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

        $scope.getForecast = function(searchResult, index){
            console.log("Show weather forecast for " + searchResult.name + " (index="+index+")");
            $scope.apiUrl = $scope.apiForcastBaseUrl + searchResult.id;
            console.log("Calling " + $scope.apiUrl);

            responsePromise = $http.get($scope.apiUrl)
                .success(function(data, status, headers, config) {
                    $scope.showForecast(data, searchResult, index);
                })
                .error(function(data, status, headers, config) {
                    console.log("Error while getting forecast for " + searchResult.name);
                });
        }

        $scope.hideForecast = function(searchResult){
            searchResult.showForecast = false;
        }

        $scope.showForecast = function(data,searchResult,index){
            console.log("Adding forecast for " + searchResult.name + "("+searchResult.id+")");
            console.log(data);
            searchResult.forecast=data;
            searchResult.showForecast=true;
            /*$scope.searchResults[index].forecast = data;
            $scope.searchResults[index].showForecast = true;*/
        }

        <!--Search function the fetches results from api or cache-->
        $scope.search = function(searchQuery) {

            <!--Check if location is in the apiLocationCache-->
            $scope.cachedResults = $scope.apiLocationCache[searchQuery.location];

            if ($scope.cachedResults == null && $scope.coordinates[searchQuery.location]!=null){
                $scope.apiUrl = $scope.apiBBoxBaseUrl + $scope.coordinates[searchQuery.location];
                console.log("Call api " + $scope.apiUrl);
                responsePromise = $http.get($scope.apiUrl)
                    .success(function(data, status, headers, config) {
                        console.log('Cacheing results..');
                        $scope.cachedResults = data;

                        <!--Put location in the apiLocationCache-->
                        $scope.apiLocationCache[searchQuery.location] = $scope.cachedResults;

                        <!--Render the view-->
                        $scope.renderView();
                    })
                    .error(function(data, status, headers, config) {
                        alert("Calling API failed! " + status);
                    });
            }

            if ($scope.cachedResults!=null){
                console.log("Get searchResults from cache.");
                <!--Render the view-->
                $scope.renderView();
            }
        };

    }]);