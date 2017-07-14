var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authConfig = require('../config/auth');

function generateToken(user){
  return jwt.sign(user, authConfig.secret, {
    expiresIn: 10080
  });
}

function setUserInfo(request){
  return {
    _id: request._id,
    firstName: request.firstName,
    lastName: request.lastName,
    username: request.username.toLowerCase(),
    roles: request.roles
  };
}

exports.login = function(req, res, next) {
  var userInfo = setUserInfo(req.user);
  console.log(req.user);
  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
};

// exports.getUser = function(req, res) {
//     var username = req.username;
//     User.findOne({username: req}, function (err, user) {
//       var userInfo = setUserInfo(user);
//       res.status(200).send(userInfo);
//     })
// };

exports.register = function(req, res, next){

  var username = req.body.username.toLowerCase();
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  //var role = req.body.role;

  if(!username){
    return res.status(422).send({error: 'You must enter an username address'});
  }

  if(!password){
    return res.status(422).send({error: 'You must enter a password'});
  }

  User.findOne({username: username}, function(err, existingUser){

    if(err){
      return next(err);
    }

    if(existingUser){
      return res.status(422).send({error: 'That username address is already in use'});
    }

    var user = new User({
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: password
    });

    user.save(function(err, user){

      if(err){
        return next(err);
      }

      var userInfo = setUserInfo(user);

      res.status(201).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
      })

    });

  });

};

exports.roleAuthorization = function(role) {
  return function (req, res, next) {
    var user = req.user;

    // if(req.user.roles.indexOf(role) === -1){
    //   res.status(401).json({error: 'You are not authorised to view this content'});
    //   res.end();
    // } else {
    //   return next();
    // }
    console.log('getting role auth');
    User.findById(user._id, function(err, foundUser){
      if(err) {
        res.status(422).json({error: 'No user found'});
      }

      if(foundUser.roles.indexOf(role) > -1){
        return next();
      }

      res.status(401).json({error: 'You are not authorized to view this content'});
      return next('Unauthorized')

    });
  }
};

exports.updateUser = function(req, res) {
  var userUpdates = req.body;
  console.log(req.body);
  console.log(req.user);

  // if(req.user._id !== userUpdates._id) {
  //   res.status(403);
  //   return res.end();
  // }

  req.user.firstName = userUpdates.firstName;
  req.user.lastName = userUpdates.lastName;
  req.user.username = userUpdates.username;
  if(userUpdates.password && userUpdates.password.length > 0) {
    req.user.password = userUpdates.password;
  }
  req.user.save(function(err) {
    if(err) { res.status(400); return res.send({reason: err.toString()})}
    res.send(req.user);
  })
};
