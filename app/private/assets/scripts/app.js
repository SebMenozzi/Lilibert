var app = angular.module('myApp', [ 'ngAnimate', 'ui.router', 'ui.router.stateHelper', 'angular-jwt', 'ngSanitize', 'pascalprecht.translate', 'ng-giphy', 'ui.select', 'monospaced.elastic' ]);

console.log("%c\nLilibert.com\n------------\nHi there ! Nice to meet you!\n\nInterested in contributing to one of the coolest entertainment platform developped with ♡ with technologies like AngularJS and NodeJS 😀 ? \n\nVisit http://lilibert.com/jobs to learn about our current job openings.\n\n",'font: "Courier New", Monospace; font-size: 18px; color: #000')

app.run(['$rootScope','$state','$http','UserService', function run($rootScope, $state, $http, UserService) {
  $rootScope.$on('$stateChangeStart', function (e, to, params) {
    // SI l'utilisateur est connecté, on fou le token en global
    if(UserService.isAuthenticated()){
      $http.defaults.headers.common['x-access-token'] = UserService.isAuthenticated();
    }
    if (to.redirectTo) {
      e.preventDefault();
      $state.go(to.redirectTo, params)
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
      name: 'setting',
      url: '/setting',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: true
      },
      templateUrl: '../../partials/User/_setting.html',
      children: [
          {
              name: 'account',
              url: '/account',
              templateUrl: '../../partials/User/Setting/_account.html'
          },
          {
              name: 'password',
              url: '/password',
              templateUrl: '../../partials/User/Setting/_password.html'
          }
      ]
    })
    .state({
      name: 'logout',
      url: '/logout',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: true
      },
      controller: ['$state','UserService', function($state, UserService){
        UserService.logout();
        $state.go('login.first');
      }]
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
      name: 'ads',
      url: '/ads',
      data: {
        roles: ['User', 'Admin'],
        requiresLogin: false
      },
      templateUrl: '../../partials/_ads.html'
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
