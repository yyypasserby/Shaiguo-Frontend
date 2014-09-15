angular.module('livesApp')
.factory('TokenHandler', function(Session) {
    var tokenHandler = {};
    var token = 'none';

    tokenHandler.set = function(newToken) {
        token = newToken;
        Session.setSessionId(newToken);
    };
    tokenHandler.get = function() {
        console.log(token);
        return token; 
       // return Session.getSessionId();  
    };
    tokenHandler.tokenWrapper = function(resource, actions) {
        var allActions = ['query','get','save','delete','remove'];    
        actions = (typeof actions === 'undefined' ? allActions : actions);

        var wrappedResource = resource;
        for(var i = 0; i < actions.length; ++i) {
            actionWrapper(wrappedResource, actions[i]);        
        }
        return wrappedResource;
    };
    var actionWrapper = function(resource, action) {
        resource['_' + action] = resource[action];
        resource[action] = function(data, success, error) {
            console.log(data);
            return resource['_' + action](
                angular.extend({}, data || {}, 
                {access_token : tokenHandler.get()}),
                success, error);
        };
    };
    return tokenHandler;
});

function dateFormat(date, format) {
    if(format === undefined){
        format = date;
        date = new Date();
    }
    var map = {
        'M': date.getMonth() + 1, //月份 
        'd': date.getDate(), //日 
        'h': date.getHours(), //小时 
        'm': date.getMinutes(), //分 
        's': date.getSeconds(), //秒 
        'q': Math.floor((date.getMonth() + 3) / 3), //季度 
        'S': date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
    return all;
    });
    return format;
}
