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
    choice: {
        type: Sequelize.STRING,
        defaultValue: 'no choice',
    },
    points: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    turn: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

User.belongsTo(Room);
Room.hasMany(User);

module.exports = User;
