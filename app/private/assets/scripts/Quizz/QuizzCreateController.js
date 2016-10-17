app.controller('QuizzCreateController', ['$scope','$state','$window','$location','$timeout','QuizzService','QuizzCategoriesService', function($scope, $state, $window, $location, $timeout, QuizzService, QuizzCategoriesService) {
    $scope.categories = QuizzCategoriesService.get();
    $scope.success = 'Finished the quiz ?';
    $scope.autosave = false;
    $scope.autosave_msg = 'Confirm the modifications';
    $scope.global = '';

    QuizzService.getByUid(function(data) {
      if(!data.success) {
        console.log('Failed to provide quizzes from this user!')
      } else {
        console.log(data)
      }
    });

    // Si un qid est renseigné dans l'url
    QuizzService.getById($location.search().qid, function(data) {
      // Si le quiz n'existe pas on en crée un nouveau
      if(!data.success) {
        console.log('No quizz for this id');
        QuizzService.create(function(data2) {
          if(!data2.success) {
            console.log('Failed to create the quizz!')
          } else {
            $scope.success = 'Quizz created successfully!';
            $scope.quizz = data2.quizz;
            $scope.global = data2;
            $location.search('qid', data2.quizz.qid);
          }
        });
      }
      // Sinon on affiche les données
      else {
        $scope.quizz = data.quizz.data;
        $scope.global = data.quizz;
      }
    });
    $scope.save = function(){
      $scope.autosave_msg = 'Wait a second...';
        QuizzService.edit($scope.global, function(data3) {
          $timeout(function() {
            if(!data3.success) {
              $scope.autosave_msg = 'Failed to save the quiz!';
            } else {
              $scope.autosave_msg = 'Quizz saved successfully!';
            }
          }, 1000);
        });
    };
    $scope.$watch('quizz', function(newValue, oldValue) {
      if(oldValue) {
        $scope.autosave = true;
      }
    }, true);
    $scope.publish = function() {
      $scope.quizz.isPublished = !$scope.quizz.isPublished;
    };
    /* Questions */
    $scope.addQuestion = function(index){
      var question = { question: '', answers:[{ answer: '', profile: '' }] };
      if($scope.quizz.questions.length <= index+1){
         $scope.quizz.questions.splice(index+1,0,question);
      }
    };
    $scope.deleteQuestion = function($event, index){
     if($event.which == 1)
        $scope.quizz.questions.splice(index,1);
    };
    /* Answers */
    $scope.addAnswer = function(index2, index){
     var answer = { answer: '', profile: '' };
     if($scope.quizz.questions[index2].answers.length <= index+1){
         $scope.quizz.questions[index2].answers.splice(index+1,0,answer);
     }
    };
    $scope.deleteAnswer = function($event, index2, index){
     if($event.which == 1)
        $scope.quizz.questions[index2].answers.splice(index,1);
    };
    /* Profiles */
    $scope.addProfile = function(index){
      var profile = { name: '', desc: '' };
      if($scope.quizz.profiles.length <= index+1){
          $scope.quizz.profiles.splice(index+1,0,profile);
      }
    };
    $scope.deleteProfile = function($event, index){
      if($event.which == 1)
         $scope.quizz.profiles.splice(index,1);
    };
    /* Picture */
    $scope.imageUpload = function(element){
       var reader = new FileReader();
       reader.onload = $scope.imageIsLoaded;
       reader.readAsDataURL(element.files[0]);
    };
    $scope.imageIsLoaded = function(e){
       $scope.$apply(function() {
           $scope.quizz.picture = e.target.result;
       });
    };
}]);
