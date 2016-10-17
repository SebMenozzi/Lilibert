app.controller('UserController', ['$scope','$state','$window','UserService','UserLanguagesService','QuizzService','$translate', function ($scope, $state, $window, UserService, UserLanguagesService, QuizzService, $translate) {
  $scope.user = {};
  $scope.success = 'Please finish the form :)';

  /* Login activities */
  $scope.login = function () {
    UserService.login($scope.user, function(data) {
      if(!data.success) {
        $scope.success = 'Oops, failed to login.';
        delete $window.sessionStorage.token;
      } else {
        $scope.success = 'You are now connected !';
        $window.sessionStorage.token = data.token;
        $state.go('home');
      }
    });
  };
  $scope.getByEmail = function () {
    UserService.getByEmail($scope.user.email, function(data) {
      if(!data.success) {
        console.log('No user for this email');
      } else {
        console.log(data)
        $scope.user.username = data.user.username;
        $scope.user.picture = data.user.picture;
      }
    });
  };
  /* Logout */
  $scope.logout = function () {
    UserService.logout(function(data) {
      if(data.success) {
        console.log('LOGOUT !');
        $state.go('login.first');
      }
    });
  };
  /* Signup activities */
  $scope.signup = function () {
    UserService.signup($scope.user, function(data) {
      if(!data.success) {
        $scope.success = 'Oops, failed to signup.';
        delete $window.sessionStorage.token;
      } else {
        $scope.success = 'You are now a member !';
        $window.sessionStorage.token = data.token;
        $state.go('home');
      }
    });
  };
  $scope.imageUpload = function(element){
      var reader = new FileReader();
      reader.onload = $scope.imageIsLoaded;
      reader.readAsDataURL(element.files[0]);
  };
  $scope.imageIsLoaded = function(e){
      $scope.$apply(function() {
          $scope.user.picture = e.target.result;
      });
  };
}]);
