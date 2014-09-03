'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the livesApp
 */
angular.module('livesApp')
.controller('MainCtrl', function ($scope, $resource) {
    $scope.user={};
    var url = 'http://localhost:8080/LivesServer/rest/:func';
    $scope.signup = function() {
        console.log($scope.user);  
        var userResource = $resource(url, {func : 'user'});
        console.log(userResource);

        var result = userResource.save($scope.user, function() {
            console.log(result);
        });
    };
});
