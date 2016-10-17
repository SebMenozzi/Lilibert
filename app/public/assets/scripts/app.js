var app = angular.module('myApp', [ 'ngAnimate', 'ui.router', 'ui.router.stateHelper', 'angular-jwt', 'ngSanitize', 'pascalprecht.translate', 'ng-giphy', 'ui.select', 'monospaced.elastic' ]);

app.run(['$rootScope','$state','$http','UserService', function run($rootScope, $state, $http, UserService) {
  $rootScope.$on('$stateChangeStart', function (e, to, params) {
    // SI l'utilisateur est connecté, on fou le token en global
    if(UserService.isAuthenticated()){
      $http.defaults.headers.common['x-access-token'] = UserService.isAuthenticated();
    }
    if (to.redirectTo) {
      e.preventDefault();
      //console.log('PARAMS: ' + params)
      console.log('TEST ' + to.redirectTo)
      $state.go(to.redirectTo)
    }
    if(to.data.requiresLogin) {
      if(!UserService.isAuthenticated()) {
        console.log('Not authenticated with requiresLogin TRUE');
        e.preventDefault();
        $state.go('login.first');
      }
    } else {
      if(UserService.isAuthenticated()) {
        console.log('Authenticated with requiresLogin FALSE');
        e.preventDefault();
        $state.go('home');
      }
    }
  });
}]);
app.run(['$rootScope','$timeout', function($rootScope, $timeout){
    $rootScope.stateIsLoading = true;
    $rootScope.$on('$stateChangeStart', function() {
        $timeout(function() {
          $rootScope.stateIsLoading = false;
        }, 300);
        //$rootScope.stateIsLoading = true;
    });
}]);
// stateHelperProvider allows to define states as an object tree, that's pretty cool
app.config(['stateHelperProvider','$urlRouterProvider','$locationProvider', function(stateHelperProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  stateHelperProvider
    .state({
      name: 'home',
      url: '/',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: true
      },
      templateUrl: '../../partials/_home.html'
    })
    .state({
      name: 'edit',
      url: '/edit',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: true
      },
      templateUrl: '../../partials/User/_edit.html'
    })
    .state({
      name: 'quizz_start',
      url: '/quizz/start/:qid',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: true
      },
      templateUrl: '../../partials/Quizz/_start.html'
    })
    .state({
      name: 'quizz_view',
      url: '/quizz/view',
      redirectTo: 'quizz_view.question',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: true
      },
      templateUrl: '../../partials/Quizz/_view.html',
      children: [
          {
              name: 'question',
              url: '/:qid?{q:int}',
              templateUrl: '../../partials/Quizz/_question.html'
          }
      ]
    })
    .state({
      name: 'quizz_result',
      url: '/quizz/result/:qid',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: true
      },
      templateUrl: '../../partials/Quizz/_result.html'
    })
    .state({
        name: 'quizz_create',
        url: '/quizz/create?qid',
        redirectTo: 'quizz_create.first',
        data: {
          roles: ['User', 'Admin'],
          requiresLogin: true
        },
        templateUrl: '../../partials/Quizz/_create.html',
        children: [
            {
                name: 'first',
                url: '/1',
                templateUrl: '../../partials/Quizz/Create/_first.html'
            },
            {
                name: 'second',
                url: '/2',
                templateUrl: '../../partials/Quizz/Create/_second.html'
            },
            {
                name: 'third',
                url: '/3',
                templateUrl: '../../partials/Quizz/Create/_third.html'
            },
            {
                name: 'fourth',
                url: '/4',
                templateUrl: '../../partials/Quizz/Create/_fourth.html'
            }
        ]
    })
    .state({
        name: 'login',
        url: '/login',
        redirectTo: 'login.first',
        data: {
          roles: ['User', 'Admin'],
          requiresLogin: false
        },
        templateUrl: '../../partials/User/_login.html',
        children: [
            {
                name: 'first',
                url: '/1',
                templateUrl: '../../partials/User/Login/_first.html'
            },
            {
                name: 'second',
                url: '/2',
                templateUrl: '../../partials/User/Login/_second.html'
            },
            {
                name: 'third',
                url: '/3',
                templateUrl: '../../partials/User/Login/_third.html'
            }
        ]
    })
    .state({
        name: 'signup',
        url: '/signup',
        redirectTo: 'signup.first',
        data: {
          roles: ['User', 'Admin'],
          requiresLogin: false
        },
        templateUrl: '../../partials/User/_signup.html',
        children: [
            {
                name: 'first',
                url: '/1',
                templateUrl: '../../partials/User/Signup/_first.html'
            },
            {
                name: 'second',
                url: '/2',
                templateUrl: '../../partials/User/Signup/_second.html'
            },
            {
                name: 'third',
                url: '/3',
                templateUrl: '../../partials/User/Signup/_third.html'
            },
            {
                name: 'fourth',
                url: '/4',
                templateUrl: '../../partials/User/Signup/_fourth.html'
            }
        ]
    })
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
}]);

/*
app.controller('MenuCtrl', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
});
*/

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '../../languages/',
    suffix: '.json'
  });
  $translateProvider.preferredLanguage('en');
  // Escape HTML to avoid XSS atack
  $translateProvider.useSanitizeValueStrategy('escape');
}]);

app.controller('MainController', ['$scope','jwtHelper','UserService', function($scope, jwtHelper, UserService) {
  $scope.$watch(UserService.isAuthenticated, function () {
    if(UserService.isAuthenticated())
      $scope.currentUser = jwtHelper.decodeToken(UserService.isAuthenticated());
    else
      $scope.currentUser = '';
  });
}]);

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

app.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue;
            }
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});
app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value, color) {
            color = 'rgba(8, 15, 255, 0.5)';
            element.css({
                'background-image': 'linear-gradient(to bottom, ' + color + ' 0%, rgba(0, 0, 0, 0.7) 100%), url(' + value + ')',
                'background-size' : 'cover',
                'background-attachment' : 'fixed'
            });
        });
    };
});

app.service('UserLanguagesService', function () {
  this.get = function () {
    return [
      { id:1, name:"fr" },
      { id:2, name:"en" },
      { id:3, name:"es" }
    ];
  };
});

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
     if($location.search().q) {
        var quizz = data.quizz.data;

        $scope.qid = $stateParams.qid;
        $scope.l = quizz.questions.length;
        $scope.title = quizz.title;
        $scope.picture = quizz.picture;

        $scope.$watch(function () {
            return $location.search().q;
        }, function (newParams, oldParams) {
            $scope.q = parseInt(newParams);
            $scope.quizz = quizz.questions[newParams];
        });

        /*

        if(q.questions.length >= $stateParams.n) {
          $scope.quizz = q.questions[$stateParams.n - 1];
          $scope.quizz.qid = $stateParams.qid;
          $scope.quizz.n = $stateParams.n;
          $scope.quizz.l = q.questions.length;
          $scope.quizz.title = q.title;
          $scope.quizz.picture = q.picture;
        }
        */
      }
   }
  });

  $scope.$watch(function () {
      return $scope.results;
  }, function (newParams, oldParams) {
      console.log($scope.results);
  });
}]);

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

app.service('QuizzCategoriesService', function () {
  this.get = function () {
    return [
      { id:1, name:"psycho" },
      { id:2, name:"astro" },
      { id:3, name:"sex" },
      { id:4, name:"social" },
      { id:5, name:"food" },
      { id:6, name:"sport" },
      { id:7, name:"politic" },
      { id:8, name:"fun" }
    ];
  };
});
