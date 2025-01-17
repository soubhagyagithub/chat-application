const Chat = require("../model/chatModel");
const Group = require("../model/groupModel");
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
    });
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};

// exports.getMessages = async (req, res, next) => {
//   try {
//     const param = req.query.param;
//     console.log(req.query.groupName);
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
