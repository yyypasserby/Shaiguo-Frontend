'use strict';

/**
 * @ngdoc function
 * @name livesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the livesApp
 */
var app = angular.module('livesApp')
.controller('MainCtrl', function ($scope, Resource, $location, SearchService, AuthService, RegisterService) {
    $scope.user={};
    $scope.background = { imgSrc : '' };
    $scope.signup = function() {
        
        RegisterService.setUser($scope.user);
        $location.path('/join');
    };

    var liveResource = Resource.getResource('hot/live');
    liveResource.query(function(result) {
        console.log('Loading Lives:');
        console.log(result);
        var userResource = Resource.getResource('user/:id');
        angular.forEach(result, function(item) {
            if(item.thumbnail === null) {
                console.log('hehe');
                item.thumbnail = 'game.png';
            }
            userResource.get({id: item.userId}, function(res) {
                item.username = res.username;
                console.log(item);
            });
        });
        $scope.lives = result; 
        console.log($scope.lives);
    });

    var casterResource = Resource.getResource('hot/caster');
    casterResource.query(function(result) {
        console.log('Loading Caster:');
        console.log(result);
        $scope.casters = result; 
    });

    var categoryResource = Resource.getResource('hot/category');
    categoryResource.query(function(result) {
        console.log('Loading Category:');
        console.log(result);
        $scope.categories = result; 
    });
    $scope.goToCastroom = function(caster) {
        if(caster.status === 1) {
            $location.path('/castroom/' + caster.username);  
        };  
    };
});

app.directive('backImg', function() {
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


app.controller('IndexImageCarouselCtrl', function($scope, Resource) {
    $scope.indexImageInterval = 5000;
    $scope.indexImageSlides = [];
    var slidesResource = Resource.getResource('indexImage');
    slidesResource.query({}, function(res) {
        $scope.indexImageSlides = res;
        console.log('slide image:');
        console.log(res);

    });

    $scope.$watch(function () {
        return $scope.indexImageSlides.filter(function(s) { return s.active; })[0];
    }, function() {
        var slide = $scope.indexImageSlides.filter(function(s) { return s.active; })[0];
        if(typeof slide === 'undefined') {
            return;
        }
        $scope.$emit('indexImageChanged', slide.imgSrc + '_blur');
    });
});
