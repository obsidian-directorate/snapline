const mongoose = require('mongoose');
require('dotenv').config();

require('../config/database');

async function resetDatabase() {
  try {
    console.log('⚠️ WARNING: This will reset the entire database!');
    console.log('   All data will be lost except system settings.');

    // Safety check - only allow in development
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Cannot reset database in production environment');
      process.exit(1);
    }

    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    console.log('✅ Database reset completed');
    console.log('📦 Run "npm run setup" to initialize with default data');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Confirm before reset
console.log('Are you sure you want to reset the database? (yes/no)');
process.stdin.on('data', (data) => {
  const input = data.toString().trim().toLowerCase();
  if (input === 'yes' || input === 'y') {
    resetDatabase();
  } else {
    console.log('Datanase reset cancelled');
    process.exit(0);
  }
});
