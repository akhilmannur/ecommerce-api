const express= require("express");
const forgetRouter = express.Router();
const ForgetPass=require("../controllers/forgetpass");
const { tryCatch } = require("../middlewares/tryCatch");


forgetRouter.route("/forgetpass/forgotpassword").post(tryCatch(ForgetPass.forgotPassword));
forgetRouter.route("/forgetpass/changepassword").post(tryCatch(ForgetPass.changePassword));


module.exports =forgetRouter;

