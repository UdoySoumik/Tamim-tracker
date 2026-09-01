/**
 * Database configuration
 * Load from environment or use defaults for local development
 */

const os = require('os');
const defaultUser = process.env.DB_USER || os.userInfo().username; // Use macOS username by default

module.exports = {
  database: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT)     || 5432,
    database: process.env.DB_NAME     || 'tamim_tracker',
    user:     defaultUser,
    password: process.env.DB_PASSWORD || '',
  },
  
  server: {
    port: process.env.PORT || 3000,
  }
};
