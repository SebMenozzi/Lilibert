var Datastore = require('nedb'),
  	path = require('path'),
    db = {};

db = new Datastore({
    filename: path.join('./server/db/blacklists.db'),
    autoload: true
});

var blacklist = {
    putToken: function (token, callback) {
        db.insert(token, function(err, data) {
            callback(err, data);
        });
    },
    getByToken: function (token, callback) {
        db.findOne({ token: token }, function (err, data) {
            callback(err, data);
        });
    },
    deleteToken: function (token, callback) {
        db.remove({ token: token }, {}, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    },
    getAllTokens: function (callback) {
        db.find({}, function (err, tokens) {
            callback(err, tokens);
        });
    },
    deleteAllTokens: function (callback) {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    },
};

module.exports = blacklist;
