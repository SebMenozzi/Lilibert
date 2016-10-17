module.exports = function ($scope, $translate, $uibModal) {
  $scope.login = function () {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: './js/partials/login.ejs',
      controller: 'LoginController'
    });
  };
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
    console.log(langKey)
  };
};
