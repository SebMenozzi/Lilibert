var express = require('express');
var router = express.Router();

var config = require('../../config.json');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var validator = require('validator'); // used to check user form data
var uuid = require('node-uuid');
var base64 = require('../../middlewares/base64.js');

// MODELS
var QuizzToken = require("../../models/quizz_token.js");

//MIDDLEWARES
var check_scopes = require("../../middlewares/scopes.js");


router.post('/', function(req, res) {
  if (req.body.picture) {
    var picture = uuid.v4() + '.jpg';
    base64.decode(req.body.picture, 'app/public/assets/quizz_pictures/' + picture);

    var quizz = {
        qid: uuid.v4(),
        data: req.body
  	}

    quizz.data.picture = 'assets/quizz_pictures/' + picture;

    if (validator.isLength(req.body.title, { min: 5, max: 60})) {
        Quizz.create(quizz, function(err, newUQuizz) {
            if (err) throw err;

            return res.json({ success: true, message: 'Quizz created successfully.', quizz: quizz });
        });
    } else {
        return res.json({ success: false, message: 'Failed to create quizz.' });
    }
  }
});

// DELETE a quizz
router.delete('/:qid', function(req, res) {
    Quizz.delete(req.params.uid, function(err, quizz) {
      if (quizz) {
        return res.json({ success: true, message: 'Quizz deleted successfully.', quizz: quizz });
      } else {
        return res.json({ success: false, message: 'Failure to delete the quizz.' });
      }
	});
});

// UPDATE a quizz
router.patch('/:qid', function(req, res) {
    /*User.update(req.params.uid, function(err, user) {
      if (user) {
        return res.json({ success: true, message: 'User deleted successfully.' });
      } else {
        return res.json({ success: false, message: 'Failure to delete the user.' });
      }
	});*/
});

module.exports = router;
