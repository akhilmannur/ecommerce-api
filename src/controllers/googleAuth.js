const UserModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const googleLogin = async (req, res) => {
  const { email, dealerId } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        dealerId,
      },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ rest, access_token: token });
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

    const newUser = await UserModel.create({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
      dealerId,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        dealerId,
      },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = newUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ rest, access_token: token });
  }
};

module.exports = {
  googleLogin,
};
