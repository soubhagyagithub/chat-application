const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./util/database");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./router/userRouter");
const homePageRouter = require("./router/homePageRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");

//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", homePageRouter);
app.use("/chat", chatRouter);
app.use("/group", groupRouter);

//Models
const User = require("./model/userModel");
const Chat = require("./model/chatModel");
const Group = require("./model/groupModel");
const UserGroup = require("./model/userGroup");

//Relationships between Tables
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
Chat.belongsTo(User);
Chat.belongsTo(Group);
User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);
UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

const PORT = process.env.PORT || 5000;
sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(PORT);
    console.log(`Server is running on ${PORT} Port`);
  })
  .catch((err) => console.log(err));
