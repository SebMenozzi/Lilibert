var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.json');
var Blacklist = require("../models/blacklist.js");

function check_scopes(scopes) {
    return function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        req.token = token;
        // decode token
        if (token) {
          Blacklist.getByToken(token, function(err, data) {
            if (data) {
              return res.json({ success: true, message: 'Sorry, token is blacklisted.' });
            } else {
              // verifies secret and checks exp
              jwt.verify(token, config.secret, function(err, decoded) {
                  if (err) {
                    // If the token is not valid
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                  }
                  else {
                    req.uid = decoded.uid;
                    next();
                  }
                  /*
                  else {
                    decoded = req.token;

                    try {
                      // We get each scope specified into the routes
                      for (var j=0; j < scopes.length; j++){
                          var data = scopes[j].split(":");
                          var action = data[0];
                          var entity = data[1];

                          if(decoded.scopes[entity][action]){
                            return next();
                          } else {
                            return res.json({ success: false, message: 'Insufficient scopes. You don\'t have the permission to ' + action + ' this ' + entity + '.'});
                          }
                      }
                    }
                    catch(e) {
                      return res.json({ success: false, message: 'Token doesn\'t have a valid syntax.' });
                    }

                  }
                  */
              });
            }
          });
        } else {
            // if there is no token
            return res.json({ success: false, message: 'No token provided.' });
        }
    }
}

module.exports = check_scopes;
