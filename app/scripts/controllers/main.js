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
    var url = 'http://localhost:8080/LivesServer/rest/:func/:method';
    $scope.signup = function() {
        console.log($scope.user);  
        var userResource = $resource(url, {func : 'user', method : 'addUser'});
        userResource.username = $scope.user.username;
        userResource.password = $scope.user.password;
        userResource.email    = $scope.user.email;

        var result = userResource.save(function() {
            console.log(result);
        });
    };
});
