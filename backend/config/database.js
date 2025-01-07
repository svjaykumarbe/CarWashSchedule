// config/database.js
const { Sequelize } = require('sequelize');

// Create a Sequelize instance and configure the connection to SQL Server
const sequelize = new Sequelize('carWashScheduler', 'username', 'password', {
  host: 'localhost',
  dialect: 'mssql',
  logging: false, // Disable logging if you don't need it
});

module.exports = sequelize;