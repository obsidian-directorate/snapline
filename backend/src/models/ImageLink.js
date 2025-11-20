const mongoose = require('mongoose');

const imageLinkSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    trim: true
  },
  file_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'files',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  render_type: {
    type: String,
    enum: ['direct', 'cached', 'proxy'],
    default: 'cached'
  },
  expires_at: Date,
  access_code: String,  // For password-protected links
  is_active: {
    type: Boolean,
    default: true
  },
  access_acount: {
    type: Number,
    default: 0
  },
  last_accessed: Date,
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes with TTL for expiration
imageLinkSchema.index({ expires_at: 1 }< { expireAfterSeconds: 0 });
imageLinkSchema.index({ created_by: 1 });
imageLinkSchema.index({ original_url: 1 });
imageLinkSchema.index({ is_active: 1 });

// Virtual for checking if link is expired
imageLinkSchema.virtual('isExpired').get(function() {
  return this.expires_at && this.expires_at < Date.now();
});

// Virtual for checking if link is accessible
imageLinkSchema.virtual('isAccessible').get(function() {
  return this.is_active && !this.isExpired;
});

// Update access statistics
imageLinkSchema.methods.recordAccess = function() {
  this.access_acount += 1;
  this.last_accessed = Date.now();
  return this.save();
};

export default mongoose.model('image_links', imageLinkSchema);
