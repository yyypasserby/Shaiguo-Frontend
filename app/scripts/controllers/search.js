'use strict';

angular.module('livesApp')
.controller('SearchCtrl', function($scope, Resource) {
    var searchResource = Resource.getResource('search/:category');
    var livesData = searchResource.query({category: 'live', content: $scope.search.content},
    function() {
        console.log(livesData);
        $scope.lives = livesData;
    });
    
    var userData = searchResource.query({category: 'user', content: $scope.search.content}, 
    function() {
        console.log(userData);
        $scope.users = userData;
    });

    var cachedData = searchResource.query({category: 'cached', content: $scope.search.content}, 
    function() {
        console.log(cachedData);
        $scope.cachedVideos = cachedData;
    });
});
