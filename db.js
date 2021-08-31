// const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.db)

// module.exports = sequelize;

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ssl: process.env.ENVIRONMENT === 'development',
});

module.exports = sequelize;