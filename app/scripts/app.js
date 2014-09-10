'use strict';

/**
 * @ngdoc overview
 * @name livesApp
 * @description
 * # livesApp
 *
 * Main module of the application.
 */
angular
.module('livesApp', [
//    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
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
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/cast', {
        templateUrl: 'views/cast.html',
        controller: 'CastCtrl'
      })
      .when('/favor', {
        templateUrl: 'views/favor.html',
        controller: 'PersonalCtrl'
      })
      .when('/favor2', {
        templateUrl: 'views/favor2.html',
        controller: 'PersonalCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
});
