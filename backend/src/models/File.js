const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  uploader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  storage_path: {
    type: String,
    required: true
  },
  file_type: {
    type: String,
    enum: ['image', 'render', 'thumbnail', 'document'],
    required: true
  },
  mime_type: {
    type: String,
    required: true
  },
  original_filename: String,
  file_size: Number,
  width: Number,
  height: Number,
  title: String,
  description: String,
  checksum: {
    type: String,
    required: true
  },
  metadata: mongoose.Schema.Types.Mixed,
  created_at: {
    type: Date,
    default: Date.now
  },
  last_accessed: {
    type: Date,
    default: Date.now
  },
  access_count: {
    type: Number,
    default: 0
  },
  is_encrypted: {
    type: Boolean,
    default: false
  },
  encryption_key: String  // Encrypted storage key
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
fileSchema.index({ uploader_id: 1 });
fileSchema.index({ file_type: 1 });
fileSchema.index({ checksum: 1 });
fileSchema.index({ created_at: -1 });
fileSchema.index({ mime_type: 1 });

// Update last_accessed timestamp
fileSchema.methods.touch = function() {
  this.last_accessed = Date.now();
  this.access_count += 1;
  return this.save();
};

module.exports = mongoose.model('files', fileSchema);
