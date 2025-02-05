const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const ArchivedChat = sequelize.define("archivedChats", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});
module.exports = ArchivedChat;
