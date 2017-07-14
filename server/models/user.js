var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  firstName: {type: String},
  lastName: {type: String},
  username: {type: String, unique: true},
  password: {type: String},
  roles: [String]
}, {
  timestamps: true
});

UserSchema.pre('save', function(next) {
  var user = this;
  if(this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if(err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods = {
  comparePassword: function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
      if(err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};

var User = mongoose.model('User', UserSchema);

User.find({}).exec(function(err, collection){
  if(collection.length === 0) {
    User.create({firstName: 'Joe', lastName: 'Eames', username: 'joe', password: 'password', roles: ['admin']});
    User.create({firstName: 'John', lastName: 'Smith', username: 'john', password: 'password', roles: ['admin']});
    User.create({firstName: 'Neil', lastName: 'Cummings', username: 'neil', password: 'password', roles: []});
    User.create({firstName: 'Amy', lastName: 'Plummer', username: 'amy', password: 'password', roles: []});
  }
});

module.exports = mongoose.model('User', UserSchema);
