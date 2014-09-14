'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # PersonalCtrl
 * Controller of the livesApp
 */
var CastInfoInstanceCtrl = function ($scope, $modalInstance, user) {

    $scope.user = user;
    console.log($scope.user);
    $scope.rtmp = 'rtmp://223.3.91.16:8080/LivesServer';
    var date = new Date();
    var hash = hex_sha1($scope.user.username + 'shaiguo' + date.getDay());
    $scope.streamName = hash.substring(13,23);
    $scope.ok = function () {
        applyFso($scope.streamName); 
        $modalInstance.close();
    };
};


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

var UserFavorInstanceCtrl = function ($scope, $modalInstance, tags, Resource, Session) {

    $scope.tags = tags;
    var old_tags = angular.copy(tags);
    console.log($scope.tags);

    $scope.addFavor = function(index){
        if(index.selected) {
            index.selected = false;
        } else {
            index.selected = true;
        }
    };

    $scope.ok = function () {
        var modify = Resource.getResource('user/modifyTags');
        var tagStr = '';
        for(var i in $scope.tags) {
            if($scope.tags[i].selected) {
                tagStr += $scope.tags[i].tagId + ',';
            } 
        }
        tagStr = tagStr.substring(0, tagStr.length - 1);
        console.log(tagStr);
        modify.save({userId: Session.getUserId(), tags: tagStr}, function(res) {
            console.log(res); 
        });
        $modalInstance.close($scope.tags);
    };

    $scope.cancel = function () {
        $modalInstance.close(old_tags);
    };
};

angular.module('livesApp')
.controller('PersonalCtrl', function ($scope, $modal, Resource, AUTH_EVENTS, Session, AuthService, TagService) {
    var pageLoader = {};
    function loadTags() {
        $scope.tags = TagService.tags;
        console.log('User tags');
        console.log($scope.user.tags);
        var tagArray = $scope.user.tags.split(',');
        console.log(tagArray);
        for(var j = 0; j < $scope.tags.length; ++j) {
            $scope.tags[j].selected = false;
            for(var i = 0; i < tagArray.length; ++i) {
                if($scope.tags[j].tagId === parseInt(tagArray[i])) {
                    console.log($scope.tags[j].tagId);
                    $scope.tags[j].selected = true;
                }
            }
        }
    }
    pageLoader.load = function() {
        $scope.showPage = true;

        var userResource = Resource.getResource('user/:id');
        $scope.user = Session.getUser();
        console.log($scope.user);

        var friendResource = Resource.getResource('friend/:id'); 
        $scope.friends = friendResource.query({id : $scope.user.userId}, function() {
            console.log('Loading friends');
            console.log($scope.friends);
        });

        var actionResource = Resource.getResource('action/friend/:id');
        $scope.actions = actionResource.query({id : $scope.user.userId}, function() {
            console.log('Loading actions');
            console.log($scope.actions);
        });


        if(typeof TagService.tags === 'undefined') {
            console.log('tags not defined!');
            var categories = Resource.getResource('tag').query();
            categories.$promise.then(function() {
                TagService.setTags(categories);
                console.log(TagService.tags);
                loadTags();
            });
        }
        else {
            loadTags();
        }

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
            $scope.tags = tags;
        });
    };

    $scope.OpenCastInfoDialog = function() {
        var modalInstance = $modal.open({
            templateUrl: 'CastInfo.html',
            controller: CastInfoInstanceCtrl,
            resolve: {
                user: function() {
                    return $scope.user;
                }
            }
        });
        modalInstance.result.then(function (user) {
            console.log('Closing Cast Info Dialog!');
        });
    };
});


