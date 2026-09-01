/**
 * Database configuration
 * Load from environment or use defaults for local development
 */

module.exports = {
  database: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT)     || 5432,
    database: process.env.DB_NAME     || 'tamim_tracker',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  
  server: {
    port: process.env.PORT || 3000,
  }
};
