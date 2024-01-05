const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  dealerId: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "dealer-details",
  },  
  username: {
    required: true,
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    required: true,
    type: String,
  },

  avatar: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgKpo9_EWHWAvV9GqfnqRJqUtvU5nyiBMg07WleMGapg&s",
  },
  otp: {
    code: {
      type: Number,
      required: false,
    },
    timestamp: {
      type: Date,
      required: false,
      expires: 300, // Expires after 300 seconds (5 minutes)
    },
  },
  cart: [{ type: mongoose.Types.ObjectId, ref: "products" }],
  wishlist: [{ type: mongoose.Types.ObjectId, ref: "products" }],
  orders: [
    {
      products: [{ type: mongoose.Types.ObjectId, ref: "products" }],
      date: Date,
      order_id: String,
      payment_id: String,
    },
  ],
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
