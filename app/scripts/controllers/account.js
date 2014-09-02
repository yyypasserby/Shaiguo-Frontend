'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the livesApp
 */
angular.module('livesApp')
.controller('AccountCtrl', function ($scope, $resource) {
    var url = 'http://localhost:8080/LivesServer/rest/:func'; 
    var userResource = $resource(url, {func : 'user'});
    var userData = userResource.get(function() {
        console.log(userData);
        $scope.user = userData;
    });
});
