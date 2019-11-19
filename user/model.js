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
Room.hasMany(User, { as: 'users', foreignKey: 'userId' });

module.exports = User;
