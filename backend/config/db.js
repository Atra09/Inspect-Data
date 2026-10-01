const { Sequelize } = require('sequelize');

const db = new Sequelize(
  process.env.DB_NAME || 'db_calokapal',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log, // Enable live SQL query logging (SELECT, INSERT, UPDATE) in terminal
  }
);

const configDb = async () => {
  try {
    await db.authenticate();
    console.log('DATABASE TERHUBUNG');
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR:', error.message);
  }
};

module.exports = { db, configDb };
