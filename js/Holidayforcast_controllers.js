var weatherApp = angular.module('weatherApp', []);

weatherApp.filter('weatherFilter',function(){
    return function(input,weathertype) {
        var returnedInputs = [];
        //Filtering on weathertype
        for (var i = 0; i < input.length; i++) {
            if (input[i].weather!=null && weathertype==input[i].weather[0].main || weathertype==null){
                returnedInputs.push(input[i]);
            }
        }
        return returnedInputs;
    };
});

weatherApp.filter('tempFilter',function(){
    return function(input,tempmin) {
        var returnedInputs = [];
        //Filtering on temperature
        for (var i = 0; i < input.length; i++) {
            if (input[i].main.temp_min!=null && tempmin<=input[i].main.temp_min || tempmin==null){
                returnedInputs.push(input[i]);
            }
        }
        return returnedInputs;
    };
});

weatherApp.controller('weatherController', ['$scope', '$http', function ($scope, $http) {

        $scope.loading=false;
        $scope.tempmin = 20;

        $scope.apiBBoxBaseUrl = "http://api.openweathermap.org/data/2.5/box/city?cluster=yes&bbox=";
        $scope.apiForcastBaseUrl ="http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&cnt=14&id=";
        $scope.apiUrl = "";

        //Object that stores bounding-box coordinates for locations
        $scope.coordinates = {
            'europe':'-24,36,43,72',
            'usa':'-169,12,-52,70'
        }
        //Initialize empty apiCache to store json results from api
        $scope.apiLocationCache = {};

        //This is used to hold the cached results for one search
        $scope.cachedResults;

        //This is iterated in the searchResults table in the view
        $scope.searchResults = [];

        //This function iterates the cachedResults and pushes the entries to the searchResults table
        $scope.renderView = function(){
            $scope.searchResults = [];
            if ($scope.cachedResults!=null){
                var len = $scope.cachedResults.cnt;
                while (len--){
                    $scope.searchResults.push($scope.cachedResults.list[len]);
                }
            }
        }

        //This function gets the forecast from the api
        $scope.getForecast = function(searchResult, index){
            //Show weather forecast for " + searchResult.name
            $scope.apiUrl = $scope.apiForcastBaseUrl + searchResult.id;
            $scope.loading=true;
            responsePromise = $http.get($scope.apiUrl)
                .success(function(data, status, headers, config) {
                    $scope.loading=false;
                    $scope.showForecast(data, searchResult, index);
                })
                .error(function(data, status, headers, config) {
                    $scope.loading=false;
                });
        }

       //This function hides the forecast
        $scope.hideForecast = function(searchResult){
            searchResult.showForecast = false;
        }

        //This function adds the forecast data to the searchResult
        $scope.showForecast = function(data,searchResult,index){
            searchResult.forecast=data;
            searchResult.showForecast=true;
        }

        //Search function that fetches results from api or cache
        $scope.search = function(searchQuery) {

            //Check if location is in the apiLocationCache
            $scope.cachedResults = $scope.apiLocationCache[searchQuery.location];

            if ($scope.cachedResults == null && $scope.coordinates[searchQuery.location]!=null){
                $scope.apiUrl = $scope.apiBBoxBaseUrl + $scope.coordinates[searchQuery.location];
                $scope.loading=true;
                responsePromise = $http.get($scope.apiUrl)
                    .success(function(data, status, headers, config) {
                        $scope.loading=false;
                        //Cacheing results
                        $scope.cachedResults = data;

                        //Put location in the apiLocationCache
                        $scope.apiLocationCache[searchQuery.location] = $scope.cachedResults;

                        //Render the view
                        $scope.renderView();
                    })
                    .error(function(data, status, headers, config) {
                        $scope.loading=false;
                        alert("Calling API failed! " + status);
                    });
            }

            if ($scope.cachedResults!=null){
                //Render the view
                $scope.renderView();
            }
        };

    }]);