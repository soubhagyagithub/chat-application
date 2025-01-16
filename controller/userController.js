const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { Op } = require("sequelize");

const getLoginPage = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
  } catch (error) {
    console.log(error);
  }
};

function generateAccessToken(id, email) {
  return jwt.sign({ userId: id, email: email }, process.env.JWT_TOKEN);
}

const postUserSignUp = async (req, res) => {
  try {
    const name = req.body.userName;
    const email = req.body.userEmail;
    const number = req.body.userNumber;
    const password = req.body.userPassword;

    // Check existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { number }],
      },
    });

    if (existingUser) {
      return res.status(404).json({
        success: false,
        message:
          "This email or number is already taken. Please choose another one.",
      });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
      }

      await User.create({
        name: name,
        email: email,
        number: number,
        password: hash,
      });

      return res.status(200).json({
        success: true,
        message: "User Created Successfully!",
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};

const postUserLogin = async (req, res) => {
  try {
    const email = req.body.loginEmail;
    const password = req.body.loginPassword;

    // Find the user by email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      // If the user does not exist
      return res.status(404).json({
        success: false,
        message: "User doesn't exist!",
      });
    }

    // Compare the provided password with the hashed password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        // If there is an error during password comparison
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong!" });
      }

      if (result) {
        // Password is correct
        return res.status(200).json({
          success: true,
          message: "Login successful!",
          token: generateAccessToken(user.id, user.email), // Token generation
        });
      } else {
        // Password is incorrect
        return res.status(401).json({
          success: false,
          message: "Incorrect password!",
        });
      }
    });
  } catch (error) {
    // Catch any other errors
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports = {
  getLoginPage,
  postUserSignUp,
  postUserLogin,
};
