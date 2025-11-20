const bcrypt = require('bcryptjs');

const database = require('../config/database');
const User = require('../models/User');
const SystemSetting = require('../models/SystemSetting');

async function setupDatabase() {
  try {
    console.log('🚀 Starting SnapLine database setup...');

    // Connect to database
    await database.connect();

    // Create default admin user if doesn't exist
    const adminExists = await User.findOne({ username: 'admin' });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);

      const adminUser = new User({
        username: 'admin',
        email: 'admin@snapline.od',
        password_hash: hashedPassword,
        role: 'admin',
        status: 'active'
      });

      await adminUser.save();
      console.log('✅ Default admin user created:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create essential system settings
    const defaultSettings = [
      { _id: 'max_upload_size', value: 10485760 },
      { _id: 'allowed_file_types', value: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] },
      { _id: 'session_timeout_hours', value: 24 },
      { _id: 'login_attempts_limit', value: 5 },
      { _id: 'enable_mfa', value: true },
      { _id: 'mfa_enforced_roles', value: ['admin'] },
      { _id: 'backup_enabled', value: true },
      { _id: 'backup_retention_days', value: 30 }
    ];

    for (const setting of defaultSettings) {
      await SystemSetting.findOneAndUpdate(
        { _id: setting._id },
        {
          value: setting.value,
          updated_at: new Date(),
          updated_by: adminExists ? adminExists._id : null
        },
        { upsert: true }
      );
    }

    console.log('✅ Default system settings configured');
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Change the default admin password');
    console.log('   2. Configure MFA for admin account');
    console.log('   3. Review system settings in admin panel');

    process.exit(0);
  } catch (error) {
    console.error(' ❌Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
