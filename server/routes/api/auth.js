var express = require('express');
var router = express.Router();

var config = require('../../config.json');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var validator = require('validator'); // used to check user form data
var uuid = require('node-uuid');
var base64 = require('../../middlewares/base64.js');

/* MODELS */
var User = require("../../models/user.js");

/* POST ROUTES */

router.post('/login', function(req, res) {
    User.getByEmail(req.body.email, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(200).send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        }
        else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                res.status(200).send({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            }
            else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign({
                    uid: user.uid,
                    username: user.username,
                    email: user.email,
                    picture: user.picture,
                    roles: user.roles,
                    exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60, // 1 week in seconds
                }, config.secret);

                res.status(200).send({
                    success: true,
                    message: 'Enjoy and keep your token secret !',
                    token: token
                });
            }
        }
    });
});

router.post('/signup', function(req, res) {
    if (req.body.picture && validator.isEmail(req.body.email) && validator.isLength(req.body.username, { min: 3, max: 20}) && validator.isLength(req.body.password, { min: 3, max: 40}) && validator.equals(req.body.password, req.body.password_confirmation)) {

      var picture = uuid.v4() + '.jpg';
      base64.decode(req.body.picture, 'app/public/assets/pictures/' + picture);

        var user = {
            uid: uuid.v4(),
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            picture: 'assets/pictures/' + picture,
            roles: {
                user: true,
                admin: false
            }
        }

        User.create(user, function(err, newUser) {
            if (err) throw err;

            // if user is created
            // create a token
            var token = jwt.sign({
                uid: user.uid,
                username: user.username,
                email: user.email,
                picture: user.picture,
                roles: user.roles,
                exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60, // 1 week in seconds
            }, config.secret);

            return res.json({ success: true, message: 'User signed up successfully.', token: token });
        });
    } else {
        return res.json({ success: false, message: 'Failed to sign up user.' });
    }
});

module.exports = router;
