app.service('QuizzService', ['$http', function ($http) {
  this.create = function (callback) {
    $http
      .post('/api/quizzes')
      .then(function(response) {
          callback(response.data)
      });
  };
  this.edit = function (qdata, callback) {
    $http
      .put('/api/quizzes/', qdata)
      .then(function(response) {
          callback(response.data)
      });
  };
  this.delete = function (qid, callback) {
      $http
        .delete('/api/quizzes/' + qid + '/quizz')
        .then(function(response) {
            callback(response.data)
        });
  };
  this.getById = function (qid, callback) {
      $http
        .get('/api/quizzes/' + qid + '/quizz')
        .then(function(response) {
            callback(response.data)
        });
  };
  this.getByUid = function (callback) {
      $http
        .get('/api/quizzes/me')
        .then(function(response) {
            callback(response.data)
        });
  };
  this.getWithParameters = function (params, callback) {
      $http
        .get('/api/quizzes/test', {params:{"category": params.category}})
        .then(function(response) {
            callback(response.data)
        });
  };
}]);
