const express = require("express");
const router = express.Router();
const chatController = require("../controller/chatController");
const authMiddleware = require("../middleware/auth");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/sendMessage", authMiddleware, chatController.sendMessage);

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  chatController.uploadFile
);
module.exports = router;
