app.service('UserService', ['$http','$window','jwtHelper', function ($http, $window, jwtHelper) {
    this.isAuthenticated = function () {
      if(!$window.sessionStorage.token || jwtHelper.isTokenExpired($window.sessionStorage.token))
          return false;
      else
        return $window.sessionStorage.token;
    };
    this.edit = function (user_data, callback) {
      $http
        .put('/api/users/', user_data)
        .then(function(response) {
            callback(response.data)
        });
    };
    this.login = function (credentials, callback) {
        $http
          .post('/api/auth/login', credentials)
          .then(function(response) {
              callback(response.data)
          });
    };
    this.logout = function (callback) {
      $http
        .post('/api/blacklist/token', { token: $window.sessionStorage.token })
        .then(function(response) {
            callback(response.data)
        });
        // We delete the session client-side
        delete $window.sessionStorage.token;
    };
    this.signup = function (credentials, callback) {
        $http
          .post('/api/auth/signup', credentials)
          .then(function(response) {
              callback(response.data)
          });
    };
    this.getByEmail = function (email, callback) {
        $http
          .get('/api/users/' + email + '/email')
          .then(function(response) {
              callback(response.data)
          });
    };
    this.getMe = function (callback) {
        $http
          .get('/api/users/me')
          .then(function(response) {
              callback(response.data)
          });
    };
}]);
