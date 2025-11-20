const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  data_type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'array', 'object'],
    default: 'string'
  },
  category: {
    type: String,
    enum: ['security', 'file_handling', 'system', 'backup', 'authentication', 'ui'],
    default: 'system'
  },
  is_public: {
    type: Boolean,
    default: false
  },
  is_encrypted: {
    type: Boolean,
    default: false
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for efficient category-based queries
systemSettingSchema.index({ category: 1 });
systemSettingSchema.index({ is_public: 1 });
systemSettingSchema.index({ updated_at: -1 });

// Static method to get all settings by category
systemSettingSchema.statics.getByCategory = function(category) {
  return this.find({ category }).lean();
};

// Static method to get public settings only
systemSettingSchema.statics.getPublicSettings = function() {
  return this.find({ is_public: true }).select('_id value description').lean();
};

// Static method to update multiple settings
systemSettingSchema.statics.updateSettings = async function(settings, userId) {
  const bulkOps = settings.map(setting => ({
    updateOne: {
      filter: { _id: setting._id },
      update: {
        $set: {
          value: setting.value,
          updated_at: new Date(),
          updated_by: userId,
          $inc: { version: 1 }
        }
      },
      upsert: true
    }
  }));

  return this.bulkWrite(bulkOps);
};

// Instance method to validate value based on data type
systemSettingSchema.methods.validateValue = function(value) {
  switch (this.data_type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    default:
      return false;
  }
};

// Pre-save middleware to validate data type
systemSettingSchema.pre('save', function(next) {
  if (!this.validateValue(this.value)) {
    const err = new Error(`Invalid value type for setting ${this._id}. Expected ${this.data_type}`);
    return next(err);
  }
  next();
});

// Virtual for formatted value based on data type
systemSettingSchema.virtual('formattedValue').get(function() {
  switch (this.data_type) {
    case 'number':
      return Number(this.value);
    case 'boolean':
      return Boolean(this.value);
    case 'array':
      return Array.isArray(this.value) ? this.value : [this.value];
    case 'object':
      return typeof this.value === 'object' ? this.value : JSON.parse(this.value);
    default:
      return String(this.value);
  }
});

export default mongoose.model('system_settings', systemSettingSchema);
