const Sequelize = require('sequelize');
const databaseURL = process.env.DATABASE_URL;
const db = new Sequelize(databaseURL);

db.sync()
    .then(() => console.log('Connected to DB', process.env.DATABASE_URL))
    .catch(console.error);

module.exports = db;
