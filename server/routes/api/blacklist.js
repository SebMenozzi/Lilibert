var express = require('express');
var router = express.Router();

var config = require('../../config.json');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var validator = require('validator'); // used to check user form data
var uuid = require('node-uuid');

// MODELS
var Blacklist = require("../../models/blacklist.js");

//MIDDLEWARES
var check_scopes = require("../../middlewares/scopes.js");
router.use('/', check_scopes());

router.get('/tokens', function(req, res) {
    Blacklist.getAllTokens(function(err, tokens) {
      if (users) {
          return res.json({ success: true, message: 'Tokens blacklisted provided successfully.', tokens: tokens });
      } else {
        return res.json({ success: false, message: 'Failure to provide tokens blacklisted.' });
      }
	});
});

router.post('/token', function(req, res) {
    var token = {
        qid: uuid.v4(),
        token: req.token,
        time: Math.floor(Date.now() / 1000)
  	}
    if(req.body.token) {
      // Cela ne veut pas dire que checkscopes vérifie le token de session qu'il ne faut pas vérifier le token du form, ils peuvent être différent !
      Blacklist.getByToken(req.body.token, function(err, data) {
        if(!data) {
          Blacklist.putToken(token, function(err, token) {
            if (token) {
              return res.json({ success: true, message: 'Token has been blacklisted successfully.' });
            } else {
              return res.json({ success: false, message: 'Failure to blacklist this token.' });
            }
          });
        } else {
          return res.json({ success: false, message: 'Token has been already blacklisted!' });
        }
      });
    } else {
      console.log('Token doesn\'t exist')
    }
});

router.get('/:token', function(req, res) {
    Blacklist.getByToken(req.params.token, function(err, token) {
      if (token) {
        return res.json({ success: true, message: 'Token is blacklisted.' });
      } else {
        return res.json({ success: false, message: 'Token is not blacklisted.' });
      }
    });
});

router.delete('/token', function(req, res) {
    Blacklist.deleteToken(req.body.token, function(err, token) {
      if (token) {
        return res.json({ success: true, message: 'Token has been deleted from blacklist successfully.' });
      } else {
        return res.json({ success: false, message: 'Failure to delete token from blacklist.' });
      }
	});
});

module.exports = router;
