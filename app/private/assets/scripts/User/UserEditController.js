app.controller('UserEditController', ['$scope','$state','UserService','UserLanguagesService','$translate', function ($scope, $state, UserService, UserLanguagesService, $translate) {
  $scope.languages = UserLanguagesService.get();
  $scope.autosave = false;
  $scope.autosave_msg = 'Confirm the modifications';

  UserService.getMe(function(data) {
    if(!data.success) {
      console.log('No user for this uid');
    }
    else {
      $scope.user = data.user;
      console.log(data.user)
    }
  });

  $scope.save = function(){
    UserService.edit($scope.user, function(data) {
      if(!data.success) {
        $scope.autosave_msg = 'Failed to update your profile!';
      } else {
        $scope.autosave_msg = 'Profile updated successfully!';
      }
    });
  };

  $scope.$watch('user', function(newValue, oldValue) {
    if(oldValue) {
      $scope.autosave = true;
    }
  }, true);

  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
    $scope.lang = langKey;
    console.log(langKey)
  };
}]);
