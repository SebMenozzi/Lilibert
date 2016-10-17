module.exports = function ($scope, $uibModal, UserService) {
  $scope.signup = function (credentials) {
    UserService.signup($scope.user, function(err) {
      if(err) {
        $scope.error = err;
      } else {
        $scope.error = '';
        $scope.$close();
      }
    });
  };
};
