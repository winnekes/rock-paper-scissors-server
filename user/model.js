const Sequelize = require('sequelize');
const sequelize = require('../db');

const Room = require('../room/model');

const User = sequelize.define(
    'user',
    {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: 'users',
    }
);

User.belongsTo(Room);

module.exports = User;
