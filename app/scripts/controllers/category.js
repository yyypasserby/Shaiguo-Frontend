'use strict';

var app = angular.module('livesApp')
.controller('CategoryCtrl', function($scope, $routeParams, Resource, TagService) {
    var engName = $routeParams.category;

    var loadPages = function() {
        $scope.mCategory = TagService.getTag(engName);
        console.log($scope.mCategory);
        var categoryResource = Resource.getResource('search/category');
        categoryResource.query({id : $scope.mCategory.tagId}, function(res) {
            console.log(res); 
            angular.forEach(res, function(item) {
                if(item.thumbnail === null) {
                    item.thumbnail = $scope.mCategory.thumbnailBig;    
                } 
                var userResource = Resource.getResource('user/:id');
                userResource.get({id: item.userId}, function(res) {
                    item.username = res.username; 
                });
            });
            $scope.lives = res;
            console.log($scope.lives);
        });
    };
    if(typeof TagService.tags === 'undefined') {
        console.log('tags not defined!');
        var categories = Resource.getResource('tag').query();
        categories.$promise.then(function() {
            TagService.setTags(categories);
            console.log(TagService.tags);
            loadPages();
        });
    } else {
        loadPages();
    }

});


