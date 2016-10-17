app.controller('MainController', ['$scope','jwtHelper','UserService', function($scope, jwtHelper, UserService) {
  $scope.$watch(UserService.isAuthenticated, function () {
    if(UserService.isAuthenticated())
      $scope.currentUser = jwtHelper.decodeToken(UserService.isAuthenticated());
    else
      $scope.currentUser = '';
  });
}]);
