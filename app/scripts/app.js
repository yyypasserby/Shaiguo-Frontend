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

var UserLoginInstanceCtrl = function($scope, $modalInstance, $rootScope, AuthService, AUTH_EVENTS, ERROR_INFO) {
    $scope.user = {};
    $scope.signIn = function() {
        var result = AuthService.login($scope.user);
        result.$promise.then(function() {
            console.log('login result is :');
            console.log(result);
            if(result.result !== 'failure') {
                console.log(result.result);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $modalInstance.close(result.object);
            }
            else {
                var msg = result.object.errorMessage;
                console.log(msg);
                $scope.errorMessage = ERROR_INFO[msg];
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            }
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss();
    };
};

app.run(function($rootScope, $modal, $location, AuthService, Resource, AUTH_EVENTS) {
    $rootScope.openLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'UserLogin.html',
            controller: UserLoginInstanceCtrl,
        });
        modalInstance.result.then(function(user) {
            console.log(user);
            $location.path('/personal');
        });
    };
    $rootScope.openNotificationCenter = function() {
        console.log(AuthService.isAuthenticated());
        console.log(AuthService.userId);
    };
    $rootScope.getSearch = function() {
        $location.path('/search');   
    };

    $rootScope.isAuth = AuthService.isAuthenticated();
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
        $rootScope.isAuth = AuthService.isAuthenticated();
    });

    $rootScope.getPreSearch = function(val) { 
        var preSearchResource = Resource.getResource('search/pre');
        return preSearchResource.query({key : val}).$promise.then(function(result) {
            var searchResults = [];
            angular.forEach(result, function(item) {
                searchResults.push(item.searchResult);    
            });
            console.log(searchResults);
            return searchResults; 
        });
    };
    $rootScope.search = {content : '', category : ''};
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
    this.destory = function() {
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

    this.isAuthenticated = function() {
        console.log(Session.getUserId());
        return ((typeof Session.getUserId()) !== 'undefined');
    };

    this.isAuthorized = function(authorizedRoles) {
        if(angular.isArray(authorizedRoles) === false) {
            authorizedRoles = [authorizedRoles];    
        }    
        return (this.isAuthenticated() &&
            authorizedRoles.indexOf(Session.getUserRole()) !== -1);
    };
});
