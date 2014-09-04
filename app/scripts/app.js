'use strict';

/**
 * @ngdoc overview
 * @name livesApp
 * @description
 * # livesApp
 *
 * Main module of the application.
 */
var app = angular
  .module('livesApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/personal', {
        templateUrl: 'views/personal.html',
        controller: 'PersonalCtrl'
      })
      .when('/lives', {
        templateUrl: 'views/lives.html',
        controller: 'LivesCtrl'
      })
      .when('/cast', {
        templateUrl: 'views/cast.html',
        controller: 'CastCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run(function($rootScope, $location) {
    $rootScope.whichActive = ['', '', ''];
    $rootScope.$on('$locationChangeStart', function() {
        var path = $location.path();
        var count = 0;
        if(path === '/lives') {
            count = 1;
        }
        if(path === '/account') {
            count = 2;
        }

        for(var i = 0; i < $rootScope.whichActive.length; ++i) {
            $rootScope.whichActive[i] = '';
        }
        $rootScope.whichActive[count] = 'active';

        console.log(count);
    });
    //$rootScope.changeActive = function() {
    //    var path = $location.path();
    //    var count = 0;
    //    if(path === '/lives') {
    //        count = 1;
    //    }
    //    if(path === '/account') {
    //        count = 2;
    //    }

    //    for(var i = 0; i < $rootScope.whichActive.length; ++i) {
    //        $rootScope.whichActive[i] = '';
    //    }
    //    $rootScope.whichActive[count] = 'active';
    //    console.log(count);
    //};
});
