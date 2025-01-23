const path = require("path");
const User = require("../model/userModel");
const Group = require("../model/groupModel");
const UserGroup = require("../model/userGroup");
const { Op } = require("sequelize");

exports.createGroup = async (req, res, next) => {
  try {
    console.log("DEBUG: Incoming request to createGroup.");
    console.log("Request Body:", req.body);

    const groupName = req.body.groupName;
    const admin = req.user ? req.user.name : null;
    const members = req.body.members;

    // Debug extracted values
    console.log("DEBUG: Extracted Variables -", { groupName, admin, members });

    // Validate inputs
    if (!groupName || groupName.trim() === "") {
      console.error("ERROR: groupName is missing or empty.");
      return res.status(400).json({ message: "Group name cannot be empty." });
    }

    if (!admin) {
      console.error("ERROR: Admin name is missing.");
      return res.status(400).json({ message: "Admin is required." });
    }

    // Log data before creating the group
    console.log("DEBUG: Data passed to Group.create:", {
      name: groupName,
      admin,
    });

    // Create the group
    const group = await Group.create({ name: groupName, admin });

    console.log("DEBUG: Group created successfully.", group);

    const invitedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: members,
        },
      },
    });

    console.log("DEBUG: Invited members retrieved.", invitedMembers);

    // Add members to the group
    await Promise.all(
      invitedMembers.map(async (user) => {
        await UserGroup.create({
          isadmin: false,
          userId: user.dataValues.id,
          groupId: group.dataValues.id,
        });
      })
    );

    // Add admin to the group
    await UserGroup.create({
      isadmin: true,
      userId: req.user.id,
      groupId: group.dataValues.id,
    });

    console.log("DEBUG: Admin and members added to the group.");

    res.status(201).json({ group: group.dataValues.name, members });
  } catch (error) {
    console.error("ERROR in createGroup:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the group." });
  }
};

exports.addToGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const members = req.body.members;

    const group = await Group.findOne({ where: { name: groupName } });
    if (group) {
      const admin = await UserGroup.findOne({
        where: {
          [Op.and]: [{ isadmin: 1 }, { groupId: group.id }],
        },
      });
      if (admin.userId == req.user.id) {
        const invitedMembers = await User.findAll({
          where: {
            email: {
              [Op.or]: members,
            },
          },
        });

        await Promise.all(
          invitedMembers.map(async (user) => {
            const response = await UserGroup.create({
              isadmin: false,
              userId: user.dataValues.id,
              groupId: group.dataValues.id,
            });
          })
        );
        res.status(201).json({ message: "Members Added Successfully!" });
      } else {
        res.status(201).json({ message: "Only Admins Can Add New Members" });
      }
    } else {
      res.status(201).json({ message: "Group doesn't exists!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      attributes: ["name", "admin"],
      include: [
        {
          model: UserGroup,
          where: { userId: req.user.id },
        },
      ],
    });
    res.status(200).json({ groups: groups });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteFromGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const members = req.body.members;

    const group = await Group.findOne({ where: { name: groupName } });
    if (group) {
      const admin = await UserGroup.findOne({
        where: {
          [Op.and]: [{ isadmin: 1 }, { groupId: group.id }],
        },
      });
      if (admin.userId == req.user.id) {
        const invitedMembers = await User.findAll({
          where: {
            email: {
              [Op.or]: members,
            },
          },
        });

        await Promise.all(
          invitedMembers.map(async (user) => {
            const response = await UserGroup.destroy({
              where: {
                [Op.and]: [
                  {
                    isadmin: false,
                    userId: user.dataValues.id,
                    groupId: group.dataValues.id,
                  },
                ],
              },
            });
          })
        );
        res.status(201).json({ message: "Members Deleted Successfully!" });
      } else {
        res.status(201).json({ message: "Only Admins Can Delete Members" });
      }
    } else {
      res.status(201).json({ message: "Group doesn't exists!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.groupMembers = async (req, res, next) => {
  try {
    const groupName = req.params.groupName;
    const group = await Group.findOne({ where: { name: groupName } });
    const userGroup = await UserGroup.findAll({
      where: { groupId: group.dataValues.id },
    });

    const users = [];

    await Promise.all(
      userGroup.map(async (user) => {
        const res = await User.findOne({
          where: { id: user.dataValues.userId },
        });
        users.push(res);
      })
    );
    res.status(200).json({ users: users });
  } catch (error) {
    console.log(error);
  }
};
