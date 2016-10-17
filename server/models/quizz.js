var Datastore = require('nedb'),
	path = require('path'),
    db = {};

db = new Datastore({
    filename: path.join('./server/db/quizz.db'), // be careful of the path :)
    autoload: true
});

var quizz = {
    create: function (quizz, callback) {
        db.insert(quizz, function(err, newQuizz) {
            callback(err, newQuizz);
        });
    },
		edit: function (qid, quizz, callback) {
        db.update({ qid: qid }, { $set: { data: quizz } }, { upsert: false }, function(err, newQuizz) {
            callback(err, newQuizz);
        });
    },
		getByName: function (name, callback) {
        db.find({ name: new RegExp(name) }, function (err, quizzes) {
            callback(err, quizzes);
        });
    },
    getByQid: function (qid, callback) {
        db.findOne({ qid: qid }, function (err, quizz) {
            callback(err, quizz);
        });
    },
    delete: function (qid, callback) {
        db.remove({ qid: qid }, {}, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    },
    getAll: function (callback) {
        db.find({}, function (err, quizzes) {
            callback(err, quizzes);
        });
    },
    deleteAll: function (callback) {
        db.remove({}, { multi: true }, function (err, numRemoved) {
            callback(err, numRemoved);
        });
    },
		getByUid: function (uid, callback) {
        db.find({ uid: uid }, function (err, quizz) {
            callback(err, quizz);
        });
    },
		getWithParameters: function (parameters, callback) {
        db.find(parameters, function (err, quizzes) {
            callback(err, quizzes);
        });
    },
};

module.exports = quizz;
