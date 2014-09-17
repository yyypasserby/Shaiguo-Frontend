'use strict';

var app = angular.module('livesApp')
.controller('FavorCtrl', function($scope, $location, TagService, AuthService, Resource, RegisterService, Session) {
    $scope.step1 = true;  
    $scope.step2 = false;  
    $scope.tags = TagService.allTags();

    var setTagsEmpty = function() {
        angular.forEach($scope.tags, function(item) {
            item.selected = false; 
        });
    };

    var user = RegisterService.getUser();
    if(user === null || typeof user === 'undefined') {
//        $location.path('/');    
    } else {
        AuthService.login(user, function(res) {
            console.log('received auth!');
            console.log(res);
        });
        setTagsEmpty();
    }

    $scope.addFavor = function(tag) {
        console.log(tag);
        if(tag.selected) {
            tag.selected = false;  
        } else {
            if($scope.step1) {
                setTagsEmpty();
            }
            tag.selected = true;    
        }
    };

    $scope.nextStep = function() {
        $scope.step1 = false;
        $scope.step2 = true;
        angular.forEach($scope.tags, function(item) {
            if(item.selected) {
                var user = RegisterService.getUser(); 
                var modifyUserResource = Resource.getResource('user/modify/castTagId');
                modifyUserResource.get({userId: Session.getUserId(), castTagId: item.tagId }, function(res) {
                    console.log(res);
                });
                user.castTagId = item.tagId;
                RegisterService.setUser(user);
                return;
            }
        });
    };
    $scope.finish = function() {
        var tagStr = '';
        angular.forEach($scope.tags, function(item) {
            if(item.selected) {
                tagStr += item.tagId + ','; 
            }
        });
        tagStr = tagStr.substring(0, tagStr.length - 1);
        var user = RegisterService.getUser();
        user.tags = tagStr;
        RegisterService.setUser(user);
        console.log(user);
        var modifyUserResource = Resource.getResource('user/modify/tags');
        modifyUserResource.get({userId: Session.getUserId(), tags: tagStr}, function(res) {
            console.log(res);
            RegisterService.registerFinished();
            AuthService.login(user);
            $location.path('/personal');
        });
    };
});
