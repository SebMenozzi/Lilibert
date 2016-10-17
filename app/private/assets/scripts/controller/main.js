module.exports =  function ($translate, $scope, $window, UserService) {
  $scope.$watch('UserService.isLoggedIn', function() {
    console.log('test');
  });

  if($window.sessionStorage.token){
    $scope.welcome = 'Welcome Sebastien Menozzi';
  } else {
    $scope.welcome = 'This is a test';
  }
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };
};
