var express = require('express');
var router = express.Router();

var config = require('../../config.json');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var validator = require('validator'); // used to check user form data
var uuid = require('node-uuid');
var base64 = require('../../middlewares/base64.js');

// MODELS
var Quizz = require("../../models/quizz.js");

//MIDDLEWARES
var check_scopes = require("../../middlewares/scopes.js");
router.use('/', check_scopes());

// GET all quizzes
router.get('/all', function(req, res) {
  Quizz.getAll(function(err, quizzes) {
    if (quizzes) {
        return res.json({ success: true, message: 'Quizzes provided successfully.', quizzes: quizzes });
    } else {
      return res.json({ success: false, message: 'Failure to provide quizzes.' });
    }
  });
});

// DELETE all quizzes
router.delete('/all', function(req, res) {
    Quizz.deleteAll(function(err, numRemoved) {
      if (numRemoved) {
        return res.json({ success: true, message: 'Quizzes deleted successfully.' });
      } else {
        return res.json({ success: false, message: 'Failure to delete quizzes.' });
      }
	});
});

// Create a quizz
router.post('/', function(req, res) {

  var quizz2 = {
      qid: uuid.v4(),
      uid: req.uid,
      data: {
          questions:[{ question: '', answers:[{ answer:'', profile:''}] }], profiles:[{ name:'', desc:''}], lastUpdate: Math.floor(Date.now() / 1000)
      }
	}

  console.log('QUIZZ: ' + quizz2)
  Quizz.create(quizz2, function(err, newQuizz) {
      if (err) throw err;

      return res.json({ success: true, message: 'Quizz created successfully.', quizz: newQuizz });
  });
});

router.put('/', function(req, res) {
  console.log('TEST: ' + req.body.qid)
  if(req.body.qid) {
    Quizz.getByQid(req.body.qid, function(err, quizz) {
      if (quizz) {
          if (req.body.data.picture && req.body.data.picture != quizz.data.picture) {
            var picture = uuid.v4() + '.jpg';
            base64.decode(req.body.data.picture, 'app/public/assets/quizz_pictures/' + picture);
            req.body.data.picture = 'assets/quizz_pictures/' + picture;
          }
          req.body.data.lastUpdate = Math.floor(Date.now() / 1000);

          Quizz.edit(req.body.qid, req.body.data, function(err, numReplaced) {
            if (err) throw err;
            return res.json({ success: true, message: 'Quizz edited successfully.', num: numReplaced });
          });
      } else {
        return res.json({ success: false, message: 'Failure to edit the quizz.' });
      }
    });
  } else {
    return res.json({ success: false, message: 'Failure to edit the quizz.' });
  }
});

// GET a quizz
router.get('/:qid/quizz', function(req, res) {
  console.log('QID: '+ req.params.qid)
  Quizz.getByQid(req.params.qid, function(err, quizz) {
    if (quizz) {
      return res.json({ success: true, message: 'Quizz provided successfully.', quizz: quizz });
    } else {
      return res.json({ success: false, message: 'Failure to provide the user.' });
    }
  });
});

// DELETE a quizz
router.delete('/:qid/quizz', function(req, res) {
    Quizz.delete(req.params.qid, function(err, quizz) {
      if (quizz) {
        return res.json({ success: true, message: 'Quizz deleted successfully.', quizz: quizz });
      } else {
        return res.json({ success: false, message: 'Failure to delete the quizz.' });
      }
	});
});

// GET a quizz
router.get('/me', function(req, res) {
  Quizz.getByUid(req.uid, function(err, quizzes) {
    if (quizzes) {
      return res.json({ success: true, message: 'Quizzes provided successfully for this user.', quizzes: quizzes });
    } else {
      return res.json({ success: false, message: 'Failure to provide quizzes from this user.' });
    }
  });
});

router.get('/test', function(req, res) {
  console.log(req.query)
  /*
  Quizz.getWithParameters(req.uid, function(err, quizzes) {
    if (quizzes) {
      return res.json({ success: true, message: 'Quizzes provided successfully for this user.', quizzes: quizzes });
    } else {
      return res.json({ success: false, message: 'Failure to provide quizzes from this user.' });
    }
  });
  */
});

router.get('/:category/quizzes', function(req, res) {
  Quizz.getByCategory(req.params.qid, function(err, quizzes) {
    if (quizzes) {
      return res.json({ success: true, message: 'Quizzes provided successfully for this user.', quizzes: quizzes });
    } else {
      return res.json({ success: false, message: 'Failure to provide quizzes from this user.' });
    }
  });
});

module.exports = router;
