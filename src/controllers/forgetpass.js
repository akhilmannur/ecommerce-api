const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const UserModel = require("../models/users");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const userExist = await UserModel.findOne({ email: email });
  if (userExist) {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const otp = randomNumber;

    const currentTime = new Date();
    const otpExpiration = new Date(currentTime.getTime() + 5 * 60000);

    sendResetPassword(email, otp, otpExpiration);
    res.status(200).json({
      message: "otp send success fully",
      success: true,
    });
  } else {
    res.status(400).json({
      message: "inValid email address",
      success: false,
    });
  }
};

const sendResetPassword = async (email, otp, otpExpiration) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "To Verify your mail",
    html: `<p>HI ${email},this is the OTP ${otp} to change the password </p>`,
  };
  const info = await transporter.sendMail(mailOption);
  const user = await UserModel.updateOne(
    { email: email },
    { $set: { "otp.code": otp, "otp.timestamp": otpExpiration } },
    { new: true }
  );
  // console.log("email has beeen send",info);
  // console.log(otp);
};

const changePassword = async (req, res) => {
  const { email, otp } = req.body;
  const password = req.body.password;

  const user = await UserModel.findOne({ email: email });
  // console.log( user.otp.timestamp>new Date(),"remaining");
  if (user) {
    if (user.otp.code == otp && user.otp.timestamp>new Date()) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updatedPassword = await UserModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hashedPassword,
            "otp.code": null,
            "otp.timestamp": null,
          },
        },
        { new: true }
      );

      if (updatedPassword) {
        res.status(200).json({
          message: "password updated successfully",
          success: true,
        });
      }
    } else {
      res.status(404).json({
        message: "invalid or expired otp",
        success: false,
      });
    }
  }
};

module.exports = {
  forgotPassword,
  changePassword,
};
