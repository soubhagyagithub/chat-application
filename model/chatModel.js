const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const Chat = sequelize.define("chats", {
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
    type: Sequelize.DATE, // Use DATE or DATETIME
    allowNull: false,
    defaultValue: Sequelize.NOW, // Automatically set current date and time
  },
});
module.exports = Chat;
