<html ng-app="">

<head> 
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.js"></script> 
        
    </head>
    

        <div data-ng-controller="personsController">
            
            <ul>
                <li data-ng-repeat="x in persons">
                    {{ x.Name + ',' + x.Country }}
                </li>
             </ul>
        
        <div data-ng-controller="testController">
            <ul>
            <li data-ng-repeat ="x in results">
                {{ x }}
                
                </li>
                
            </ul>
            
            </div>
   
<script> 
    var app = angular.module("myApp", []);
    
            app.controller("personsController", function($scope, $http) {
        $http.get ("http://www.w3schools.com/website/Customers_JSON.php") 
        .success(function(response) {$scope.persons=response;}); 
    }); 
    
        app.controller("testController", function($scope, $http)  {
            var responsePromise = $http.get("http://api.openweathermap.org/data/2.5/weather?q=Oslo,no")
            responsePromise.success(function(response) {$scope.results = response;});
            responsePromise.error (function(data, status, headers, config) { 
                alert("Failed!");
            });
        });
    </script>
</html>