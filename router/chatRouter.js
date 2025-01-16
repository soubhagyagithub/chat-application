const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const authMiddleware = require("../middleware/auth");
router.post(
  "/sendMessage",
  authMiddleware.authenticate,
  chatController.sendMessage
);
module.exports = router;
