const { sequelize } = require('./models');
const logger = require('./utils/logger');

async function setupDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Create/sync tables
    await sequelize.sync({ force: false, alter: true });
    logger.info('Database tables synchronized successfully');

    // Create logs directory if it doesn't exist
    const fs = require('fs');
    const path = require('path');
    
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      logger.info('Created logs directory');
    }

    logger.info('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();