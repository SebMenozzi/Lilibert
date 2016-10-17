app.controller('HomeController', ['$scope','QuizzService','$translate', function ($scope, QuizzService, $translate) {
  QuizzService.getByUid(function(data) {
    if(!data.success) {
      $scope.quizzes = 'There is no quizz...';
    } else {
      $scope.quizzes = data.quizzes;
      console.log($scope.quizzes)
    }
  });

  $scope.deleteQuizz = function(qid, $index){
    $scope.quizzes.splice($index,1)
    QuizzService.delete(qid, function(data) {
      if(!data.success) {
        console.log('Failed to delete the quizz!')
      } else {
        console.log(data)
      }
    });
  };

  var params = {};
  params.category = 'Fun';

  QuizzService.getWithParameters(params, function(data) {
    if(data.success) {
      console.log(data)
    }
  });
}]);
