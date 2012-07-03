var simplerouter = function () {
  var URL = require('url');

  var routes = [],
      defaultRoute,
      defaultError = {
        statusCode: 501,
        statusMessage: 'Not Implemented'
      },
      that;

  var requestListener = function (request, response) {
    var parsedUrl = URL.parse(request.url);
    if (!routes.some(function (route, ix) {
      if (route.method !== undefined) {
        if (typeof route.method === 'string' && request.method !== route.method) {
          return false;
        }
        else if (typeof route.method === 'object' && route.method.indexOf(request.method) === -1) {
          return false;
        }
      }
      if (typeof route.url === 'string') {
        route.url = new RegExp(route.url);
      }
      var matches = parsedUrl.path.match(route.url);
      if (matches === null) {
        return false;
      }
      else {
        // route matched, handle request to response action:
        if (matches.length > 1) {
          route.action(request, response, matches);
        }
        else {
          route.action(request, response);
        }
        return true; // stop processing of further route tests
      }
    })) { // no route found, ...
      if (defaultRoute !== undefined) { // ... but we have a default one:
        defaultRoute.action(request, response);
      }
      else {
        // ... and we have no default one - return HTTP error:
        response.writeHead(defaultError.statusCode, defaultError.statusMessage);
        response.end();
      }
    }
    // one route matches -> nothing to be done since response handling is done by corresponding route.action...
  };
  that = requestListener;

  // PUBLIC METHODS:
  var addRoutes = function (rs) {
    var i;
    if (typeof rs === 'object' && rs.constructor !== Array) { // single route object:
      routes.push(rs);
    }
    else { // [] of route objects:
      for (i = 0; i < rs.length; i++) {
        routes.push(rs[i]);
      }
    }
  };
  that.addRoutes = addRoutes;
  that.addRoute = addRoutes; // for convenience


  var setDefaultRoute = function (route) {
    defaultRoute = route;
  };
  that.setDefaultRoute = setDefaultRoute;


  var setDefaultError = function (error) {
    defaultError = error;
  };
  that.setDefaultError = setDefaultError;


  // init with optionally given routes:
  if (arguments.length > 0) {
    for (var i = 0; i < arguments.length; i++) {
      addRoutes(arguments[i]);
    }
  }


  return that;
};
module.exports = simplerouter;
