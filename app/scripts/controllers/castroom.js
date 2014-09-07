'use strict';

angular.module('livesApp')
.controller('CastroomCtrl', function ($scope) {
    $scope.chatpool = [];
    for(var i = 0; i < 10; ++i) {
        $scope.chatpool.push({username : 'CANCAN', content : 'Yes, I love it, too'});    
    }
    $scope.saySth = function($event) {
        if($scope.chatContent === '') {
            return;
        }
        $scope.chatpool.push({username : 'YAOYAO', content : $scope.chatContent });
        $scope.$broadcast('ChatpoolChanged', $scope.chatId);
        $scope.chatContent = '';
        $event.preventDefault();
    };
});

angular.module('livesApp')
.directive('chatPool', function() {
    return {
        controller:function($scope, $element) {
            $scope.$on('ChatpoolChanged', function() {
                var pool = $element[0];
                console.log(pool);
                pool.scrollTop = pool.scrollHeight;
            });

        }
    };
});

