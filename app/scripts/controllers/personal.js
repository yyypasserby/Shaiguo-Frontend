'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # PersonalCtrl
 * Controller of the livesApp
 */

var UserSettingsInstanceCtrl = function ($scope, $modalInstance, settings) {

    $scope.settings = settings;
    console.log($scope.settings);

    $scope.ok = function () {
        $modalInstance.close($scope.settings);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var UserFavorInstanceCtrl = function ($scope, $modalInstance, tags) {

    $scope.tags = tags;
    console.log($scope.tags);

    $scope.addFavor = function(index){
        if(tags[index].selected) {
            tags[index].selected = false;
        } else {
            tags[index].selected = true;
        }
    };

    $scope.ok = function () {
        $modalInstance.close($scope.settings);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

angular.module('livesApp')
.controller('PersonalCtrl', function ($scope, $modal, Resource, AUTH_EVENTS, Session, AuthService, TagService) {
    var pageLoader = {};
    pageLoader.load = function() {
        $scope.showPage = true;

        var userResource = Resource.getResource('user/:id');
        $scope.user = Session.getUser();
        console.log($scope.user);

        var messageResource = Resource.getResource('message/:id');
        $scope.messages = messageResource.query({id : $scope.user.userId}, function() {
            console.log($scope.messages);
        });


        $scope.tags = TagService.tags;
        console.log('User tags');
        console.log($scope.user.tags);
        console.log($scope.user.tagList);
        for(var i = 0; i < $scope.user.tagList.length; ++i) {
            for(var j = 0; j < $scope.tags.length; ++j) {
                if($scope.tags[j].tagId === $scope.user.tagList[i]) {
                    $scope.tags[j].selected = true;
                    console.log($scope.user.tagList[i]);
                }    
            }
        }

        var friendResource = Resource.getResource('friend/:id'); 
        $scope.friends = friendResource.query({id : $scope.user.userId}, function() {
            console.log($scope.friends);
        });
    };

    if(AuthService.isAuthenticated()) {
        console.log('loading pages');
        pageLoader.load();
    }
    else {
   //     $scope.openLoginModal();    
    }

    $scope.$on(AUTH_EVENTS.loginSuccess, function() {
        pageLoader.load();
    });

    $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
        $scope.showPage = false;
    });

    $scope.openUserSettings = function() {
        var modalInstance = $modal.open({
            templateUrl: 'UserSettings.html',
            controller: UserSettingsInstanceCtrl,
            resolve: {
                settings: function () {
                    return $scope.user;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    };

    $scope.openUserFavor = function() {
        var modalInstance = $modal.open({
            templateUrl: 'UserFavor.html',
            controller: UserFavorInstanceCtrl,
            resolve: {
                tags: function() {
                    return $scope.tags;
                }
            }
        });
        modalInstance.result.then(function (tags) {
            $scope.tag = tags;
        });
    };
});


