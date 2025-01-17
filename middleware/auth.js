const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization"); // Get token from the header
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access Denied: No Token Provided" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

    // Find the user in the database
    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

// Export the function
module.exports = { authenticate };
