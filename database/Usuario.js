const Sequelize = require('sequelize');
const connection = require('./database');

const Usuario = connection.define('usuarios', {
    usuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    repostas: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    avatarUrl: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

Usuario.sync({force: false}).then(() => {});

module.exports = Usuario;