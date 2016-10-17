var Datastore = require('nedb'),
	path = require('path'),
    db = {};

db = new Datastore({
    filename: path.join('./server/db/users.db'), // be careful of the path :)
    autoload: true
});

var user = {
    /* USER ROLE */
    create: function (user, callback) {
        db.insert(user, function(err, newUser) {
            callback(err, newUser);
        });
    },
		edit: function (uid, user, callback) {
        db.update({ uid: uid }, { $set: { password: user.password, email: user.email, picture: user.picture, lang: user.lang } }, { upsert: false }, function(err, newUser) {
            callback(err, newUser);
        });
    },
		getByName: function (name, callback) {
        db.find({ name: new RegExp(name) }, function (err, users) {
            callback(err, users);
        });
    },
    getByUid: function (uid, callback) {
        db.findOne({ uid: uid }, function (err, user) {
            callback(err, user);
        });
    },
    getByEmail: function (email, callback) {
        db.findOne({ email: email }, function (err, user) {
            callback(err, user);
        });
    },
    delete: function (uid, callback) {
        db.remove({ uid: uid }, {}, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    },
    getAll: function (callback) {
        db.find({}, function (err, users) {
            callback(err, users);
        });
    },
    deleteAll: function (callback) {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    },
};

module.exports = user;
