const express= require("express");
const googleRouter = express.Router();
const GoogleAuth= require("../controllers/googleAuth");
const { tryCatch } = require("../middlewares/tryCatch");
const { accessKeyCheck } = require("../middlewares/accessKeyCheck");


googleRouter.route("/googleAuth/googlelogin").post(accessKeyCheck,tryCatch(GoogleAuth.googleLogin));

module.exports =googleRouter;