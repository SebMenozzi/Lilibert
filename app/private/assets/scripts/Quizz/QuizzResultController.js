app.controller('QuizzResultController', ['$scope','$state','$stateParams','QuizzService', function($scope, $state, $stateParams, QuizzService) {
  $scope.quizz = {};

  $scope.getNumber = function(num){
    return new Array(num);
  }

  var $stateParams = params;

  // On vérifie la validité du qid
  QuizzService.getById(params.qid, function(data) {
   if(!data.success) {
      console.log('No quiz for this id');
   } else {
     if(params.n) {
        var q = data.quizz.data;
        var n = params.n - 1;

        if(q.questions.length >= params.n) {
          $scope.quizz = q.questions[n];
          $scope.quizz.qid = params.qid;
          $scope.quizz.n = params.n;
          $scope.quizz.l = q.questions.length;
          $scope.quizz.title = q.title;
          $scope.quizz.picture = q.picture;
        }
      } else {

      }
   }
  });

/*
  $scope.$watch(function () {
      return $stateParams.n;
  }, function (newParams, oldParams) {
      console.log(newParams, oldParams);
      if (newParams != oldParams) {
          var params = {};
          params.qid = $stateParams.qid;
          params.n = newParams;
          get(params);
      }
  });
  */
}]);
