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
    'ui.bootstrap',
    'ui.utils'
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
            if(result.result !== 'failure') {
                console.log(result.result);
                $modalInstance.close(result.object);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
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

app.run(function($rootScope, $modal, AuthService) {
    $rootScope.openLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'UserLogin.html',
            controller: UserLoginInstanceCtrl,
        });
        modalInstance.result.then(function(user) {
        });
    };
    $rootScope.openNotificationCenter = function() {
        console.log(AuthService.isAuthenticated());
        console.log(AuthService.userId);
    };
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

app.service('Session', function() {
    this.sessionId = null;
    this.userId = null;
    this.userRole = null;
    this.create = function(sid, uid, userRole) {
        this.sessionId = sid;
        this.userId = uid;
        this.userRole = userRole;
    };
    this.destory = function() {
        this.sessionId = null;
        this.userId = null;
        this.userRole = null;
    };
    return this;
});

app.service('Resource', function($resource, Server) {
    this.getResource = function(resName) {
        var res = $resource(Server.getServerAddress() + '/' + resName);
        return res;
    }; 
    return this;
});

app.service('AuthService', function($resource, $rootScope, Session, Resource) {
    this.login = function(user) {
        var authResource = Resource.getResource('auth');
        return authResource.save(user, function(result) {
            if(result.result !== 'failure') {
                Session.create(result.result, result.object.username, result.object.userRole);
            }
            console.log(result);
            return result;
        });
    };

    this.isAuthenticated = function() {
        return (Session.userId !== null);
    };

    this.isAuthorized = function(authorizedRoles) {
        if(angular.isArray(authorizedRoles) === false) {
            authorizedRoles = [authorizedRoles];    
        }    
        return (this.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);
    };
});
