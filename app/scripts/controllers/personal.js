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

var UserFavorInstanceCtrl = function ($scope, $modalInstance, settings) {

    $scope.settings = settings;
    console.log($scope.settings);
    $scope.selected = {
        item: $scope.settings[0]
    };

    $(document).ready(function(){
      $(".favor").mouseover(function(){
        $(this).css("box-shadow","2px 2px 5px");
      });
    });
    $scope.attention = function(){
        var value = $(".favor").attr("value");
        
        if(value == "0"){
            $(".attention").show("fast");
            $(".favor").attr("value","1");
        }
        else{
            $(".attention").hide("fast");
            $(".favor").attr("value","0");
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
.controller('PersonalCtrl', function ($scope, $modal, Resource, AUTH_EVENTS, Session, AuthService) {
    var pageLoader = {};
    pageLoader.load = function() {
        $scope.showPage = true;
        var messageResource = Resource.getResource('message/:id');
        $scope.messages = messageResource.query({id : Session.getUserId()}, function() {
            console.log($scope.messages);
        });

        var userResource = Resource.getResource('user/:id');
        $scope.user = userResource.get({id : Session.getUserId()}, function() {
            console.log($scope.user);
        });

        var friendResource = Resource.getResource('friend/:id'); 
        $scope.friends = friendResource.query({id : Session.getUserId()}, function() {
            console.log($scope.friends);
        });
    };

    if(AuthService.isAuthenticated()) {
        pageLoader.load();    
    }
    $scope.$on(AUTH_EVENTS.loginSuccess, function() {
        pageLoader.load();
    });


    $scope.open = function() {
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

    $scope.open2 = function() {
        var modalInstance = $modal.open({
            templateUrl: 'UserFavor.html',
            controller: UserFavorInstanceCtrl,
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

    jQuery(document).ready(function() {   
        var a = $("#floatbox").offset();   
        $(window).scroll(function() {   
            var b = $(window).scrollTop();   
            if (b > a.top + 5) {   
                $("#divfloat").addClass("fixed")   
            } else {   
                $("#divfloat").removeClass("fixed")   
            }   
        });   
    });   
});


