'use strict';

var app = angular.module('livesApp')
.controller('CastroomCtrl', function ($scope, Resource, $routeParams, Session, AuthService, AUTH_EVENTS, $location) {
    var castername = $routeParams.username;
    $scope.chatpool = [];
    $scope.saySth = function($event) {
        if(AuthService.isAuthenticated() === false) {
            $scope.$emit('needToLogin');
            return;
        }
        if($scope.chatContent === '') {
            return;
        }
        var content = {};
        content.username = Session.getUser().username;
        content.content = $scope.chatContent;
        content.time = dateFormat('yyyy-MM-dd hh:mm:ss');
        $scope.chatpool.push(content);
        sendChatMessage(angular.toJson(content));
        
        $scope.$broadcast('ChatpoolChanged');
        $scope.chatContent = '';
        $event.preventDefault();
    }; 

    $scope.receiveMsg = function(json) {
        if(json === null || typeof json === 'undefined') {
            return;    
        }  
        $scope.chatpool.push(angular.fromJson(json));
        console.log($scope.chatpool);
        $scope.$broadcast('ChatpoolChanged');
    };

    $scope.jumpAnchor = function(anchor) {
        $location.path('/castroom/' + anchor);    
    }
   
    var casterResource = Resource.getResource('user/username/:username');
    casterResource.get({username: castername}, function(user) {
        if(user.userId === 0) {
            if(AuthService.isAuthenticated()) {
                $location.path('/personal');    
            }
            else {
                $location.path('/');    
            }
        }
        if(user.thumbnail === null) {
            user.thumbnail = 'default.png';
        }
        $scope.caster = user;
        $scope.$broadcast('CasterLoadFinish', user);
    });

    var liveResource = Resource.getResource('casting/:username');
    liveResource.get({username: castername}, function(live) {
        $scope.live = live;
        if(live.liveId === 0) {
            live.livename = castername + "的直播间";
            live.isCasting = 'false';    
        }
        else {
            live.isCasting = 'true';    
        }
        $scope.$broadcast('LiveLoadFinish', live);
    });
    $scope.$on(AUTH_EVENTS.loginSuccess, function() {
        $scope.$broadcast('CasterLoadFinish', $scope.caster); 
    });
    $scope.$on('addOneClicked', function($event) {
        var message = Session.getUser().username;
        message += "给了主播一个赞!";
        var content = {};
        content.username = "系统消息:"
        content.content = message;
        content.time = dateFormat('yyyy-MM-dd hh:mm:ss');
        console.log(content);
        $scope.chatpool.push(content);
        sendChatMessage(angular.toJson(content));
        
        $scope.$broadcast('ChatpoolChanged');
        $event.preventDefault();
    });
});

app.directive('chatPool', function() {
    return {
        controller:function($scope, $element) {
            $scope.$on('ChatpoolChanged', function() {
                var pool = $element[0];
                pool.scrollTop = pool.scrollHeight;
            });
        }
    };
});

app.directive('subscribeBtn', function(Resource, Session, AuthService) {
    return {
        link: function(scope, ele, attrs) {
            var subCheckResource = Resource.getResource('subscribe/check');
            scope.$on('CasterLoadFinish', function(e, d) {
                console.log('logging user');
                console.log(d);
                if(AuthService.isAuthenticated() === false) {
                    ele.bind('click', function() {
                        if(scope.isDisabled) {return;}
                        scope.$emit('needToLogin'); 
                    });
                    return;
                }
                subCheckResource.get({from_id: Session.getUserId(), to_id: d.userId},
                    function(result) {
                        console.log(result);
                        if(result.result === 'true') {
                            ele.addClass('disabled');
                            ele.removeClass('btn-primary');
                            ele.html('已订阅');
                        } 
                    });
                ele.unbind('click');
                ele.bind('click', function() {
                    if(scope.isDisabled) {return;}
                    var subscribeResource = Resource.getResource('subscribe');
                    subscribeResource.get({from_id: Session.getUserId(), to_id: scope.caster.userId},
                        function(result) {
                            console.log('Subscribe processing');
                            console.log(result);
                            ele.addClass('disabled');
                            ele.removeClass('btn-primary');
                            ele.html('已订阅');
                        }
                    );
                });
            });
        }
    };
});

app.directive('addOneBtn', function(AuthService, Session, Resource) {
    return {
        link: function(scope, ele, attrs) {
            scope.$on('LiveLoadFinish', function(e, d) {
                console.log('loading lives');
                console.log(d);
                ele.bind('click', function() {
                    if(AuthService.isAuthenticated() === false) {
                        scope.$emit('needToLogin');
                        return;
                    }
                    if(Session.getUser().remainUps <= 0) {
                        return;    
                    }
                    var addOneResource = Resource.getResource('user/addOne');
                    addOneResource.get({userId: Session.getUserId(), casterId: d.userId}, function(res) {
                        if(res.result === 'failed') {
                            console.log(res); 
                        }
                        else {
                            scope.$emit('UserActionOccur', d); 
                            scope.$emit('addOneClicked', d);
                        }
                    });
                });
            });
        }
    };
});

app.directive('livePlayer', function() {
    return {
        scope: { src:'=liveloc' },
        link: function(scope, ele, attrs) {
            scope.$on('LiveLoadFinish', function(e, d) {
            //attrs.$observe('src', function(value) {
                //if(value) {
                    ele.html(
        '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + 
        'id="videoClient" width="820" height="600"' +
        'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" style="float:left">' +
        '<param name="movie" value="videoClient.swf?id=<?php echo(rand());?>" />' +
        '<param name="quality" value="high" />' +
        '<param name="bgcolor" value="#fff" />' + 
        '<param name="allowScriptAccess" value="sameDomain" />' + 
        '<embed src="flash/videoClient.swf?id=<?php echo(rand());?>&fileName=' + d.location + 
        '&videoName=Game1&isCasting=' + d.isCasting + '&serverUrl=rtmfp://223.3.91.16/LivesServer" quality="high" bgcolor="#fff" width="800" height="520" name="videoClient" align="middle" play="true" loop="false" quality="high" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" allowFullScreen="true" pluginspage="http://www.macromedia.com/go/getflashplayer">' +
        '</embed>' + 
        '</object>');
              //  }
            //});
            });
        }
    };
});
