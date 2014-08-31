'use strict';

angular.module('livesApp')
.controller('LivesCtrl', function($scope, $resource) {
    var url = 'http://localhost:8080/com.nixinger.restTest/rest/:func'; 
    var liveResource = $resource(url, {func : 'lives'});
    var livesData = liveResource.get(function() {
        console.log(livesData);
        $scope.lives = livesData.object;
    });

    $scope.search = function() {
        var hello = $resource(url, {func : 'hello'});
        var data = hello.get(function() {
            console.log(data.hello);    
        });
    };
});
