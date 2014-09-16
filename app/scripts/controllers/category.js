'use strict';

var app = angular.module('livesApp')
.controller('CategoryCtrl', function($scope, $routeParams, Resource, TagService) {
    var engName = $routeParams.category;
    $scope.mCategory = TagService.getTag(engName);
});


