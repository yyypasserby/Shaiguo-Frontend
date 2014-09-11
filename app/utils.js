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
