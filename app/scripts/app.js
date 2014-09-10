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
      //$httpProvider.defaults.headers.common.access_token = 'hehe';
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

app.run(function($rootScope, $modal, $location, AuthService) {
    $rootScope.openLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'UserLogin.html',
            controller: UserLoginInstanceCtrl,
        });
        modalInstance.result.then(function(user) {
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
/*
app.factory('TokenHandler', function(Session) {
    var tokenHandler = {};
    var token = 'none';

    tokenHandler.set = function(newToken) {
        token = newToken;
        Session.setSessionId(newToken);
    };
    tokenHandler.get = function() {
        console.log(token);
        return token; 
       // return Session.getSessionId();  
    };
    tokenHandler.tokenWrapper = function(resource, actions) {
        var allActions = ['query','get','save','delete','remove'];    
        actions = (typeof actions === 'undefined' ? allActions : actions);

        var wrappedResource = resource;
        for(var i = 0; i < actions.length; ++i) {
            actionWrapper(wrappedResource, actions[i]);        
        }
        return wrappedResource;
    };
    var actionWrapper = function(resource, action) {
        resource['_' + action] = resource[action];
        resource[action] = function(data, success, error) {
            console.log(data);
            return resource['_' + action](
                angular.extend({}, data || {}, 
                {access_token : tokenHandler.get()}),
                success, error);
        };
    };
    return tokenHandler;
});*/
