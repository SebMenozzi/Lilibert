app.controller('QuizzStartController', ['$scope','$state','$stateParams','QuizzService', function($scope, $state, $stateParams, QuizzService) {
  $scope.quizz = {};

  // On vérifie la validité du qid
  QuizzService.getById($stateParams.qid, function(data) {
   if(!data.success) {
      console.log('No quiz for this id');
   } else {
     $scope.quizz = data.quizz.data;
     $scope.quizz.qid = $stateParams.qid;
   }
  });
}]);
