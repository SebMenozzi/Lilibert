var express = require('express');
var router = express.Router();

var config = require('../../config.json');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var validator = require('validator'); // used to check user form data
var uuid = require('node-uuid');

// MODELS
var User = require("../../models/user.js");

//MIDDLEWARES
var check_scopes = require("../../middlewares/scopes.js");

// GET all users
router.get('/all', check_scopes(), function(req, res) {
    User.getAll(function(err, users) {
      if (users) {
          return res.json({ success: true, message: 'Users provided successfully.', users: users });
      } else {
        return res.json({ success: false, message: 'Failure to provide users.' });
      }
	});
});

// DELETE all users
router.delete('/all', check_scopes(), function(req, res) {
    User.deleteAll(function(err, numRemoved) {
      if (numRemoved) {
        return res.json({ success: true, message: 'Users deleted successfully.' });
      } else {
        return res.json({ success: false, message: 'Failure to delete users.' });
      }
	});
});

// GET a user
/*
router.get('/:uid', check_scopes(['read:user']), function(req, res) {
    User.getByUid(req.params.uid, function(err, user) {
      if (user) {
        return res.json({ success: true, message: 'User provided successfully.', user: user });
      } else {
        return res.json({ success: false, message: 'Failure to provide the user.' });
      }
	});
});
*/

router.get('/:email/email', function(req, res) {
    User.getByEmail(req.params.email, function(err, user) {
      if (user) {
        return res.json({ success: true, message: 'User provided successfully.', user: user });
      } else {
        return res.json({ success: false, message: 'Failure to provide the user.' });
      }
	});
});

router.get('/me', check_scopes(), function(req, res) {
    User.getByUid(req.uid, function(err, user) {
      if (user) {
        return res.json({ success: true, message: 'User provided successfully.', user: user });
      } else {
        return res.json({ success: false, message: 'Failure to provide the user.' });
      }
	});
});

// DELETE a user
router.delete('/:uid', check_scopes(), function(req, res) {
    User.delete(req.params.uid, function(err, user) {
      if (user) {
        return res.json({ success: true, message: 'User deleted successfully.', user: user });
      } else {
        return res.json({ success: false, message: 'Failure to delete the user.' });
      }
	});
});

// UPDATE a user
router.put('/', check_scopes(), function(req, res) {
  User.getByUid(req.uid, function(err, user) {
    console.log(req.uid)
    if (user) {
        if (req.body.picture && req.body.picture != user.picture) {
          var picture = uuid.v4() + '.jpg';
          base64.decode(req.body.picture, 'app/public/assets/pictures/' + picture);
          req.body.picture = 'assets/pictures/' + picture;
        }

        console.log(req.body)

        User.edit(req.uid, req.body, function(err, numReplaced) {
          if (err) throw err;
          return res.json({ success: true, message: 'User edited successfully.', num: numReplaced });
        });
    } else {
      return res.json({ success: false, message: 'Failure to edit the user.' });
    }
  });
});

module.exports = router;
