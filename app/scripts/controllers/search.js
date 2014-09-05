'use strict';

angular.module('livesApp')
.controller('SearchCtrl', function($scope, $resource) {
    var url = 'http://localhost:8080/LivesServer/rest/search/:func'; 
    var liveResource = $resource(url, {func : 'live' , key : 'DOTA2'});
    var livesData = liveResource.query(function() {
        console.log(livesData);
        $scope.lives = livesData;
    });
    
    var userResource = $resource(url, {func : 'user', key : 'yyypasserby'});
    var userData = userResource.query(function() {
        console.log(userData);
        $scope.users = userData;
    });

    var cachedVideoResource = $resource(url, {func : 'cached', key : 'yyypasserby'});
    var cachedVideoData = cachedVideoResource.query(function() {
        cachedVideoData.forEach(function(item) {
        });
    });
    $scope.search = function() {
        var live = $resource(url, {id : $scope.query});
        var data = live.get(function() {
            console.log(data.livename);    
        });
    };
});
