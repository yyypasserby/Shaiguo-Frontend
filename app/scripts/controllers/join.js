'use strict';

var app = angular.module('livesApp')
.controller('JoinCtrl', function($scope, $location, RegisterService, Resource) {
    $scope.user = {};
    var register = function() {
        var userResource = Resource.getResource('user');
        userResource.save(RegisterService.getUser(), function(res) {
            console.log(res);
            if(res.result === 'failure') {
                $scope.error = {};
                $scope.error.result = true;
                $scope.error.message = '你填写的信息可能有错';
                RegisterService.registerFinished();
            }
            else {
                $location.path('/favor');    
            }
        });
    };
    register();
    $scope.createUser = function() {
        RegisterService.setUser($scope.user);
        register();
    };
});

app.service('RegisterService', function() {
    this.getUser = function() {
        return this.registerUser;  
    };
    this.setUser = function(user) {
        this.registerUser = user;  
    };
    this.registerFinished = function() {
        this.registerUser = null;  
    };
});
