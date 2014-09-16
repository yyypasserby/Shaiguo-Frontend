'use strict';

var app = angular.module('livesApp')
.controller('JoinCtrl', function($scope, $location, RegisterService, Resource) {
    $scope.user = {};
    var register = function() {
        var user = RegisterService.getUser();
        $scope.error = {};
        if(typeof user === 'undefined' || user === null) {
            $scope.error.result = true;
            $scope.error.message = '用户名格式不正确';
            return;
        }
        if(typeof user.username === 'undefined') {
            $scope.error.result = true;
            $scope.error.message = '用户名格式不正确';
            return;
        }
        if(typeof user.password === 'undefined') {
            $scope.error.result = true;
            $scope.error.message = '密码格式不正确';
            return;
        }
        if(typeof user.email === 'undefined') {
            $scope.error.result = true;
            $scope.error.message = '邮箱格式不正确';
            return;
        }

        if(user.username.length === 0 && user.password.length === 0 && user.email.length === 0) {
            return;    
        }
        var userResource = Resource.getResource('user');
        userResource.save(user, function(res) {
            console.log(res);
            if(res.result === 'failure') {
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
