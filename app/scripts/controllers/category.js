'use strict';

var app = angular.module('livesApp')
.controller('CategoryCtrl', function($scope, $routeParams, Resource, TagService) {
    var engName = $routeParams.category;
    $scope.mCategory = TagService.getTag(engName);
});

app.factory('TagService', function(Resource) {
    var tagService = {};
    tagService.setTags = function(tags) {
        tagService.tags = tags;        
    };

    tagService.getTag = function(name) {
        for(var i in tagService.tags) {
            if(tagService.tags[i].tagNameEng === name) {
                console.log('Get cate by id from categoryHash: ');
                console.log(tagService.tags[i]);
                return tagService.tags[i];    
            }    
        }
    };
    return tagService;
});
