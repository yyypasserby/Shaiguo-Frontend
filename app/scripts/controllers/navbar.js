'use strict';

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


var app = angular.module('livesApp')
.controller('NavbarCtrl', function($scope, $modal, $location, Resource, AuthService, AUTH_EVENTS, SearchService, $rootScope) {
    $scope.openLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'UserLogin.html',
            controller: UserLoginInstanceCtrl,
        });
        modalInstance.result.then(function(user) {
            $location.path('/personal');
        });
    };

    $scope.openNotificationCenter = function() {
    };
    $scope.getSearch = function() {
        SearchService.setSearchContent($scope.searchContent);
        if($location.path() === '/search') {
            $rootScope.$broadcast('searchPageReload'); 
        }
        else {
            $location.path('/search');
        }
    };

    $scope.goToIndex = function() {
        $location.path('/'); 
    };
    $scope.getPreSearch = function(val) { 
        var preSearchResource = Resource.getResource('search/pre');
        return preSearchResource.query({key : val}).$promise.then(function(result) {
            var searchResults = [];
            angular.forEach(result, function(item) {
                searchResults.push(item.searchResult);    
            });
            return searchResults; 
        });
    };
    $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
        $scope.isAuth = AuthService.isAuthenticated();
    });

    $scope.$on(AUTH_EVENTS.loginSuccess, function() {
        $scope.isAuth = AuthService.isAuthenticated();
    });

    $scope.search = {content : '', category : ''};
    $scope.logOut = function() {
        AuthService.logout();
        $scope.goToIndex();
    };
});

app.directive('navItem', function($location) {
    return function(scope, element, attrs) {
        var elementPath = attrs.navItem.substring(1);
        scope.$on('$routeChangeSuccess', function() {
            var locationPath = $location.path();
            if(elementPath === locationPath) {
                element.addClass('active');
            } else {
                element.removeClass('active');
            }
        });
    };
});



