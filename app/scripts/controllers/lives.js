'use strict';

angular.module('livesApp')
.controller('LivesCtrl', function($scope, $resource) {
    var url = 'http://localhost:8080/LivesServer/rest/live/:id'; 
    var liveResource = $resource(url);
    var livesData = liveResource.query(function() {
        console.log(livesData);
        $scope.lives = livesData;
    });

    $scope.search = function() {
        var live = $resource(url, {id : $scope.query});
        var data = live.get(function() {
            console.log(data.livename);    
        });
    };
});
