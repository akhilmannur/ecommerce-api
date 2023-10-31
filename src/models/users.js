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
    type: String
  },
  password: {
    required: true,
    type: String,
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
  ]
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
