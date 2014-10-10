
angular.module('formSubmit', [])
    .controller('weatherSearchController', ['$scope', function($scope) {
      $scope.search = [];
      $scope.text = 'hello';
      $scope.submit = function() {
        if ($scope.search) {
          $scope.search.push(this.text);
          $scope.text = '';
        }
      };
    }]);