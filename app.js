const express = require("express");
const app = express();

const bodyParser = require("body-parser");

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

//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", homePageRouter);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
