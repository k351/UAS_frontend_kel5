const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

// User Schema
const usersSchema = new Schema({ 
  name: { type: String, lowercase: true, required: true, unique: true },
  email: { type: String, required: true, lowercase: true, unique: true, match: [/.+@.+\..+/, 'Please use a valid email address']},
  password: { type: String, required: true }, }, {
  timestamps: true // Menambahkan createdAt dan updatedAt
});

// Hash the password before saving
usersSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

usersSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', usersSchema);
