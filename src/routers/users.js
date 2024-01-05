const express = require("express");
const router = express.Router();
const Users = require("../controllers/users");
const { tryCatch } = require("../middlewares/tryCatch");
const { accessKeyCheck } = require("../middlewares/accessKeyCheck");
const verifyToken = require("../middlewares/tokenVerify");

router
  .route("/users/register")
  .post(accessKeyCheck, tryCatch(Users.registerUser));

router.route("/users/login").post(accessKeyCheck, tryCatch(Users.loginUser));
router.route("/users/forgotpassword").post(tryCatch(Users.forgotPassword));
router.route("/users/changepassword").post(tryCatch(Users.changePassword));
router.route("/users/goooglelogin").post(tryCatch(Users.googleLogin));

router
  .route("/users/:id/cart")
  .get(verifyToken, tryCatch(Users.viewItemsInCart));

router
  .route("/users/:id/cart/:productId")
  .post(verifyToken, tryCatch(Users.addToCart))
  .delete(verifyToken, tryCatch(Users.removeFromCart));
router
  .route("/users/:id/wishlist")
  .get(verifyToken, tryCatch(Users.viewItemsInWishlist));

router
  .route("/users/:id/wishlist/:productId")
  .delete(verifyToken, tryCatch(Users.removeFromWishlist))
  .post(verifyToken, tryCatch(Users.addToWishlist));
module.exports = router;
