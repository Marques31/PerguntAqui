const Sequelize = require('sequelize')

const connection = new Sequelize('perguntaqui', 'root', '@Akjnhjci123', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;