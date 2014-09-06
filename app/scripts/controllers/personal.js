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
    $scope.selected = {
        item: $scope.settings[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.settings);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

angular.module('livesApp')
.controller('PersonalCtrl', function ($scope, $resource, $modal) {
    var url = 'http://localhost:8080/LivesServer/rest/:func';
    var messageResource = $resource(url, {func: 'message', userId : 0});
    $scope.messages = messageResource.query(function() {
        console.log($scope.messages);
    });
    
    var personResource = $resource(url, {func : 'user', userId : 0});
    $scope.user = personResource.get(function() {
        console.log($scope.user);
    });

    var friendResource = $resource(url, {func: 'friend', userId : 0});
    $scope.friends = friendResource.query(function() {
        console.log($scope.friends);
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
});


