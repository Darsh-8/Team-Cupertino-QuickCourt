import { sequelize } from '../config/database';
import { syncDatabase } from '../models';
import { seedDemoData } from './seedData';

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up QuickCourt database...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models (create tables)
    await syncDatabase(false); // Don't force drop tables
    console.log('✅ Database models synchronized');

    // Seed demo data
    await seedDemoData();
    console.log('✅ Demo data seeded successfully');

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 You can now start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;