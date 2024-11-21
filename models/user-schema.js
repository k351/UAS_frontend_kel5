const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const usersSchema = new Schema({
  name: {type: String, lowercase: true, required:true, unique:true},
  email: {type: String, required:true, lowercase:true, unique:true},
  password: {type: String, required:true},
});

usersSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next (err);
        user.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', usersSchema);