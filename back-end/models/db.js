const Sequelize = require('sequelize');
const sequelize = new Sequelize("hackitall_live", 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    logging: false
})

module.exports = sequelize;