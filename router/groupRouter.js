const express = require("express");
const router = express.Router();
const groupController = require("../controller/groupController");
const authMiddleware = require("../middleware/auth");
router.post(
  "/createGroup",
  authMiddleware.authenticate,
  groupController.createGroup
);
router.post(
  "/addToGroup",
  authMiddleware.authenticate,
  groupController.addToGroup
);
router.get(
  "/getGroups",
  authMiddleware.authenticate,
  groupController.getGroups
);
module.exports = router;
