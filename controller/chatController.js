const path = require("path");
const User = require("../model/userModel");
const Chat = require("../model/chatModel");
const Group = require("../model/groupModel");
const S3Services = require("../services/s3Services");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("getMessages", async (groupName) => {
    try {
      const group = await Group.findOne({ where: { name: groupName } });
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });
      console.log("Request Made");
      io.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  });
});

exports.sendMessage = async (req, res, next) => {
  try {
    const group = await Group.findOne({
      where: { name: req.body.groupName },
    });

    await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      groupId: group.dataValues.id,
      time: new Date(),
    });
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    console.log(req.file);
    const filename = `user-${req.user.id}/${
      req.file.filename
    }_${new Date()}.png`;
    console.log(filename);
    const fileURL = await S3Services.uploadToS3(req.file.path, filename);
    res.status(200).json({ success: true, fileURL });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// exports.getMessages = async (req, res, next) => {
//   try {
//     const param = req.query.param;

//     const group = await Group.findOne({
//       where: { name: req.query.groupName },
//     });
//     const messages = await Chat.findAll({
//       where: {
//         [Op.and]: {
//           id: {
//             [Op.gt]: param,
//           },
//           groupId: group.dataValues.id,
//         },
//       },
//     });
//     return res.status(200).json({ messages: messages });
//   } catch (error) {
//     console.log(error);
//   }
// };
