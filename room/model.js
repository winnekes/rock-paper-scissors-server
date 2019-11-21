const Sequelize = require('sequelize');
const sequelize = require('../db');

const Room = sequelize.define('room', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'not running',
    },
    winner: {
        type: Sequelize.STRING,
        defaultValue: 'no winner',
    },
});

module.exports = Room;
