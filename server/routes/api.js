var MODEL_PATH = '../models/'

var AuthenticationController = require('../controllers/authentication');
var express = require('express');
var passportService = require('../config/passport');
var passport = require('passport');
var User = require(MODEL_PATH + 'user');

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});

var router = express.Router();

router.post('/signin', requireLogin, AuthenticationController.login);
router.post('/register', AuthenticationController.register);
router.put('/users', requireAuth, AuthenticationController.updateUser);

// router.get('/users', requireAuth);
router.get('/user/:username', requireAuth, function(req, res) {
  var username = req.param('username');
  User.findOne({username: username}, function (err, user) {
    res.status(200).send(user);
  });
});

router.get('/users', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {
  User.find({}).exec(function(err, collection) {
    res.send(collection);
  })
});


module.exports = router;
