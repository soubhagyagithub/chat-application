const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./router/userRouter");

//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
