// DATABASE CONNECT
const { Sequelize } = require("sequelize");

module.exports = new Sequelize("codegig", "postgres", "572l2047da", {
  host: "localhost",
  dialect: "postgres",
});
