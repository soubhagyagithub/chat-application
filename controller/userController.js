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
