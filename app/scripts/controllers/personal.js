'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # PersonalCtrl
 * Controller of the livesApp
 */
angular.module('livesApp')
.controller('PersonalCtrl', function ($scope, $resource) {
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
        console.log($scope.friend);
    });

});
