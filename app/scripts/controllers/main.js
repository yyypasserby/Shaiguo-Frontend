'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the livesApp
 */
angular.module('livesApp')
.controller('MainCtrl', function ($scope, $resource, $location) {
    $scope.user={};
    $scope.background = { imgSrc : '' };
    var url = 'http://localhost:8080/LivesServer/rest/:func';
    $scope.signup = function() {
        console.log($scope.user);  
        var userResource = $resource(url, {func : 'user'});
        console.log(userResource);

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
.controller('IndexImageCarouselCtrl', function($scope, $resource) {
    $scope.indexImageInterval = 5000;
    $scope.indexImageSlides = [];
    var url = 'http://localhost:8080/LivesServer/rest/indexImage';
    var slidesResource = $resource(url);
    var slides = slidesResource.query(function() {
        $scope.indexImageSlides = slides;
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
