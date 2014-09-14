'use strict';

var app = angular.module('livesApp')
.controller('CastroomCtrl', function ($scope, Resource, $routeParams, $sce) {
    var castername = $routeParams.username;
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };
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

    var liveResource = Resource.getResource('casting/:username');
    liveResource.get({username: castername}, function(live) {
        $scope.live = live;
        $scope.$broadcast('LiveLoadFinish', live);
        var casterResource = Resource.getResource('user/:userId');
        casterResource.get({userId: live.userId}, function(user) {
            $scope.caster = user;
            $scope.$broadcast('CasterLoadFinish', user);
        });
    });
});

app.directive('chatPool', function() {
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

app.directive('subscribeBtn', function(Resource, Session) {
    return {
        link: function(scope, ele, attrs) {
            var subCheckResource = Resource.getResource('subscribe/check');
            scope.$on('CasterLoadFinish', function(e, d) {
                console.log('logging user');
                console.log(d);
                subCheckResource.get({from_id: Session.getUserId(), to_id: d.userId},
                    function(result) {
                        console.log(result);
                        if(result.result === 'true') {
                            ele.addClass('disabled');
                            ele.removeClass('btn-primary');
                            ele.html('已订阅');
                        } 
                    });
                ele.bind('click', function() {
                    if(scope.isDisabled) {return;}
                    var subscribeResource = Resource.getResource('subscribe');
                    subscribeResource.get({from_id: Session.getUserId(), to_id: scope.caster.userId},
                        function(result) {
                            console.log('Subscribe processing');
                            console.log(result);
                        }
                        );
                });
            });
        }
    };
});

app.directive('addOneBtn', function() {
    return {
        link: function(scope, ele, attrs) {
            scope.$on('LiveLoadFinish', function(e, d) {
                console.log('loading lives');
                console.log(d);
                ele.bind('click', function() {
                    scope.$emit('UserActionOccur', d); 
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
            console.log('hehe');
            console.log(d);
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
        '<embed src="flash/videoClient.swf?id=<?php echo(rand());?>&fileName=' + d.location + '&videoName = Game1&serverUrl=rtmfp://223.3.91.16/LivesServer" quality="high" bgcolor="#fff" width="800" height="520" name="videoClient" align="middle" play="true" loop="false" quality="high" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" allowFullScreen="true" pluginspage="http://www.macromedia.com/go/getflashplayer">' +
        '</embed>' + 
        '</object>');
              //  }
            //});
            });
        }
    };
});
