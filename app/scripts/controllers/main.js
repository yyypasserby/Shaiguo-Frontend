'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the livesApp
 */
angular.module('livesApp')
.controller('MainCtrl', function ($scope, Resource, $location) {
    $scope.user={};
    $scope.background = { imgSrc : '' };
    $scope.signup = function() {
        console.log($scope.user);  
        var userResource = Resource.getResource('user');

        var result = userResource.save($scope.user, function() {
            if(result.result === true) {
                $location.path('/personal');
            }
            console.log(result);
        });
    };
});

angular.module('livesApp')
.directive('backImg', function() {
    return function(scope, element)  {
        element.css({
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
        });
        scope.$on('indexImageChanged', function(event, data) {
            var url = data + '.jpg';
            element.css({
                'background-image': 'url(' + url + ')'
            });
        });
    };   
});

angular.module('livesApp')
.controller('IndexImageCarouselCtrl', function($scope, Resource) {
    $scope.indexImageInterval = 5000;
    $scope.indexImageSlides = [];
    var slidesResource = Resource.getResource('indexImage');
    var slides = slidesResource.query({}, function() {
        $scope.indexImageSlides = slides;
        console.log(slides);
    });

    $scope.$watch(function () {
        return slides.filter(function(s) { return s.active; })[0];
    }, function() {
        var slide = slides.filter(function(s) { return s.active; })[0];
        if(slide.imgSrc === null) {
            return;
        }
        $scope.$emit('indexImageChanged', slide.imgSrc + '_blur');
    });
});
