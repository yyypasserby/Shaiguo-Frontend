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

angular.module('livesApp')
.controller('PersonalCtrl', function ($scope, $modal, Resource, AuthService, Session) {
    $scope.showPage = AuthService.isAuthenticated();
    console.log($scope.showPage);
    if(AuthService.isAuthenticated()) {
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

    }

    $scope.open = function() {
        console.log(AuthService.isAuthenticated());
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
});


