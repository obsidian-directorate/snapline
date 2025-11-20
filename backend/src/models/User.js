const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: [
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and under cores'
    ]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please ener a valid email'
    ]
  },
  password_hash: {
    type: String,
    required: true
  },
  mfa_enabled: {
    type: Boolean,
    default: false
  },
  mfa_secret: {
    type: String,
    select: false // Don't include in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'disabled', 'suspended'],
    default: 'active'
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  lock_until: Date,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  last_login: Date
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });
userSchema.index({ created_at: -1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lock_until && this.lock_until > Date.now());
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.checkPassword = async function(password) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked due to failed login attempts');
  }

  const isMatch = await bcrypt.compare(password, this.password_hash);

  if (!isMatch) {
    this.login_attempts += 1;

    if (this.login_attempts >= parseInt(process.env.LOGIN_ATTEMPTS_LIMIT)) {
      this.lock_until = Date.now() + (parseInt(process.env.LOGIN_TIMEOUT_MINITES) * 60 * 1000);
    }

    await this.save();
    return false;
  }

  // Reset login attempts on successful login
  if (this.login_attempts > 0) {
    this.login_attempts = 0;
    this.lock_until = undefined;
    await this.save();
  }

  return true;
};

// Static method to find by username or email
userSchema.statics.findByLogin = async function(login) {
  let user = await this.findOne({ username: login });
  if (!user) {
    user = await this.findOne({ email: login });
  }
  return user;
};

export default mongoose.model('users', userSchema);
