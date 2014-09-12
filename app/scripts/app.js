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
      .when('/castroom', {
        templateUrl: 'views/castroom.html',
        controller: 'CastroomCtrl'
      })
      .when('/favor', {
        templateUrl: 'views/favor.html',
        controller: 'PersonalCtrl'
      })
      .when('/favor2', {
        templateUrl: 'views/favor2.html',
        controller: 'PersonalCtrl'
      })
      .when('/join', {
        templateUrl: 'views/join.html',
        controller: 'PersonalCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
});

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    roomAdmin: 'room-admin',
    user: 'user'
})
.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})
.constant('RUN_MODES', {
    testing: 'test',
    running: 'remote'
})
.constant('ERROR_INFO', {
    USERNAME_NOT_EXIST : 'Username not existed',
    USERNAME_PASSWORD_NOT_MATCHED : 'Credentials not available',
    USERNAME_NOT_VALID : 'Username not valid',
    PASSWORD_NOT_VALID : 'Password not valid'
});

app.run(function($rootScope, AuthService, AUTH_EVENTS) {
    $rootScope.isAuth = AuthService.isAuthenticated();
    $rootScope.$watch(AuthService.isAuthenticated(), function() {
        console.log('index detect! Authentication changed!');
        console.log(AuthService.isAuthenticated);
        $rootScope.isAuth = AuthService.isAuthenticated();
    });
});

app.service('Server', function(RUN_MODES) {
    this.serverAddress = {
        testServer: 'http://localhost:8080/LivesServer/rest/:api',
        remoteServer: 'http://223.3.80.99:8080/LivesServer/rest/:api'
    };
    this.getServerAddress = function(status) {
        status = typeof status !== 'undefined' ? status : RUN_MODES.testing;
        switch(status) {
            case RUN_MODES.testing:
                return this.serverAddress.testServer;
            case RUN_MODES.running:
                return this.serverAddress.remoteServer;
        }
    }; 
    return this;
});

app.service('Session', function($window) {
    this.create = function(sid, uid, userRole) {
        $window.sessionStorage.sessionId = sid;
        $window.sessionStorage.userId = uid;
        $window.sessionStorage.userRole = userRole;
    };
    this.destroy = function() {
        $window.sessionStorage.sessionId = null;
        $window.sessionStorage.userId = null;
        $window.sessionStorage.userRole = null;
    };
    this.getUserId = function() {
        return $window.sessionStorage.userId;    
    };
    this.setSessionId = function(newSessionId) {
        $window.sessionStorage.sessionId = newSessionId;
    };
    this.getSessionId = function() {
        return $window.sessionStorage.sessionId;    
    };
    this.getUserRole = function() {
        return $window.sessionStorage.userRole;
    };
    return this;
});

app.service('Resource', function($http, $resource, Server) {
    this.getResource = function(resName) {
        //$http.defaults.headers.common['hehe'] = 'access_token';
        var res = $resource(Server.getServerAddress() + '/' + resName);
        //res = TokenHandler.tokenWrapper(res);
        return res;
    }; 
});

app.service('AuthService', function($rootScope, Session, Resource, AUTH_EVENTS) {
    this.login = function(user) {
        var authResource = Resource.getResource('auth');
        return authResource.save(user, function(result) {
            if(result.result !== 'failure') {
                Session.create(result.result, result.object.userId, result.object.userRole);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                console.log(result.object.userId);
            }
            return result;
        });
    };
    this.logout = function() {
        Session.destroy();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    };

    this.isAuthenticated = function() {
        console.log(Session.getSessionId());
        console.log(typeof Session.getSessionId());
        if(Session.getSessionId() === 'null') {
            console.log(Session.getSessionId());
            return false;    
        }
        else if(typeof Session.getSessionId() === 'undefined') {
            console.log(typeof Session.getSessionId());
            return false;
        }
        return true;
    };

    this.isAuthorized = function(authorizedRoles) {
        if(angular.isArray(authorizedRoles) === false) {
            authorizedRoles = [authorizedRoles];    
        }    
        return (this.isAuthenticated() &&
            authorizedRoles.indexOf(Session.getUserRole()) !== -1);
    };
});
