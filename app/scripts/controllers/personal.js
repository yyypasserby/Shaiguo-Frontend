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
    var url = 'http://localhost:8080/LivesServer/rest/message';
    var messageResource = $resource(url, {userId : 1});
    $scope.messages = messageResource.query(function() {
        console.log($scope.messages);
    });
});
