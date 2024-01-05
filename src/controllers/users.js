const AppError = require("../utils/AppError");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/users");

module.exports = {
  registerUser: async (req, res) => {
    const { dealerId, username, email, password } = req.body;

    const User = await UserModel.find({ email });

    if (User.length > 0) {
      throw new AppError("User Already Exists", "User Already Exists", 400);
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const AddUser = await UserModel.create({
      username,
      email,
      password: hashedPass,
      dealerId,
    });

    const token = jwt.sign(
      { username: User.username, email: User.email, dealerId },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    const userId = AddUser._id.toString();

    res.status(201).json({
      status: "success",
      message: "User Added successfully",
      data: {
        userId,
        token,
      },
    });
  },

  loginUser: async (req, res) => {
    const { dealerId, email, password } = req.body;

    const User = await UserModel.findOne({ email });

    if (!User) {
      throw new AppError("User Not Found", "User Not Found", 404);
    }

    const comparePass = await bcrypt.compare(password, User.password);

    if (!comparePass) {
      throw new AppError("Invalid Credentials", "Invalid Credentials", 400);
    }

    const token = jwt.sign(
      { username: User.username, email: User.email, dealerId },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const userId = User._id.toString();

    res.status(200).json({
      status: "success",
      message: "User Logged In successfully",
      data: {
        userId,
        token,
      },
    });
  },

  addToCart: async (req, res) => {
    const { productId } = req.params;
    const { id } = req.params;
    const { dealerId } = req.user;
    console.log(dealerId)
    const addToCart = await UserModel.updateOne(
      { _id: id, dealerId },
      { $addToSet: { cart: productId } }
    );
 
    if (addToCart.modifiedCount === 0) {
      throw new AppError(
        `Product Already Exist`,
        "Product already Exist!",
        404
      );
    }

    res.status(200).json({
      status: "success",
      message: "Product added to the cart successfully",
    });
  },

  viewItemsInCart: async (req, res) => {
    const { id } = req.params;
    const { dealerId } = req.user;
    const products = await UserModel.find({ _id: id, dealerId })
      .populate("cart")
      .select(
        "-username -password -email -wishlist -isAdmin -orders -dealerId"
      );

    res.status(200).json({
      status: "success",
      message: "Cart items fetched successfully",
      data: {
        products,
      },
    });
  },

  removeFromCart: async (req, res) => {
    const { productId } = req.params;
    const { id } = req.params;
    const { dealerId } = req.user;

    const removeFromCart = await UserModel.updateOne(
      { _id: id, dealerId },
      { $pull: { cart: productId } }
    );

    if (removeFromCart.modifiedCount === 0) {
      throw new AppError(`Product Not Found`, "Product Not Found!", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Product removed from the cart successfully",
    });
  },

  addToWishlist: async (req, res) => {
    const { productId } = req.params;
    const { id } = req.params;
    const { dealerId } = req.user;

    const addToWishlist = await UserModel.updateOne(
      { _id: id, dealerId },
      { $addToSet: { wishlist: productId } }
    );

    if (addToWishlist.modifiedCount === 0) {
      throw new AppError(
        `Product already exist`,
        "Product already exist!",
        404
      );
    }

    res.status(200).json({
      status: "success",
      message: "Product added to the wishlist successfully",
    });
  },

  viewItemsInWishlist: async (req, res) => {
    const { id } = req.params;
    const { dealerId } = req.user;

    const products = await UserModel.find({ _id: id, dealerId })
      .populate("wishlist")
      .select("-username -password -email -cart -isAdmin -orders");

    res.status(200).json({
      status: "success",
      message: "Wishlist items fetched successfully",
      data: {
        products,
      },
    });
  },

  removeFromWishlist: async (req, res) => {
    const { productId } = req.params;
    const { id } = req.params;
    const { dealerId } = req.user;

    const removeFromWishlist = await UserModel.updateOne(
      { _id: id, dealerId },
      { $pull: { wishlist: productId } }
    );

    if (removeFromWishlist.modifiedCount === 0) {
      throw new AppError(
        `Product already Removed from wishlist.`,
        "Product Already removed from wishlist!",
        404
      );
    }

    res.status(200).json({
      status: "success",
      message: "Product removed from the wishlist successfully",
    });
  },
};
