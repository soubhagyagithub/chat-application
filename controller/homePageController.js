const path = require("path");
const User = require("../model/userModel");
const sequelize = require("../util/database");
exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "homePage.html")
    );
  } catch {
    (err) => console.log(err);
  }
};
