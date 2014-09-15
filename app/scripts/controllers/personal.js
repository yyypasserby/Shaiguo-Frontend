'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # PersonalCtrl
 * Controller of the livesApp
 */
var CastInfoInstanceCtrl = function ($scope, $modalInstance, Resource, user) {

    $scope.user = user;
    console.log($scope.user);
    $scope.rtmp = 'rtmp://223.3.91.16:8080/LivesServer';
    $scope.livename = user.username + '的直播间';
    $scope.tag = 23;
    var applyForCast = Resource.getResource('casting/apply');
    var live = {};
    live.userId = user.userId;
    live.livename = $scope.livename;
    live.tag = $scope.tag;
    applyForCast.save(live, function(res) {
        console.log(res);
        $scope.streamName = res.object;
    });
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
        console.log('tags modified');
        console.log(tagStr);
        console.log(Session.getUserId());
        modify.get({userId: Session.getUserId(), tags: tagStr}, function(res) {
            console.log(res); 
            Session.setNewTags(tagStr);
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

        $scope.messages = [];
        var friendResource = Resource.getResource('friend/:id'); 
        friendResource.query({id : $scope.user.userId}, function(friends) {
            console.log('Loading friends');
            $scope.friends = friends;
            angular.forEach(friends, function(friend) {
                var actionResource = Resource.getResource('action/user/:id');
                actionResource.query({id : friend.userId}, function(actions) {
                    angular.forEach(actions, function(action) {
                        var videoResource = Resource.getResource('video/:id');
                        videoResource.get({id : action.vid}, function(video) {
                            if(video.thumbnail === null) {
                                video.thumbnail = 'chinavoice.png';
                            }
                            var casterResource = Resource.getResource('user/:id');
                            casterResource.get({id: video.userId}, function(caster) {
                                var message = {};
                                message.video = video;
                                message.user = friend;
                                message.time = action.time;
                                message.caster = caster;
                                $scope.messages.push(message);
                                console.log(message);
                            });
                        });
                    });
                });
            });
            console.log($scope.friends);
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


