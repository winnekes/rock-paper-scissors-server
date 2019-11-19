const Sequelize = require('sequelize');
const sequelize = require('../db');

const Room = require('../room/model');

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

User.belongsTo(Room);

module.exports = User;
