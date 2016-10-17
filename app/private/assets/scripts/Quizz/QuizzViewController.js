app.controller('QuizzViewController', ['$scope','$state','$stateParams','$location','QuizzService', function($scope, $state, $stateParams, $location, QuizzService) {
  $scope.quizz = {};
  $scope.results = {};

  $scope.getNumber = function(num){
    return new Array(num);
  }

  // On vérifie la validité du qid
  QuizzService.getById($stateParams.qid, function(data) {
   if(!data.success) {
      console.log('No quiz for this id');
   } else {
    var quizz = data.quizz.data;

    if(!$location.search().q) {
      $state.go('quizz_view.question', { q: 0 });
    }

    $scope.qid = $stateParams.qid;
    $scope.l = quizz.questions.length;
    $scope.title = quizz.title;
    $scope.picture = quizz.picture;

    $scope.$watch(function () {
        return $location.search().q;
    }, function (newParams, oldParams) {
      if(quizz.questions.length > newParams) {
        $scope.q = parseInt(newParams);
        $scope.quizz = quizz.questions[newParams];
      } else {
        $state.go('quizz_view.question', { q: 0 });
      }
    });
   }
  });

  $scope.addResult = function(index, data){
   var result = { data: data };
   $scope.results[index] = result;
   console.log($scope.results);
  };
}]);
