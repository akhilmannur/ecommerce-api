const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    cart: [
        { type: mongoose.Types.ObjectId, ref: 'products' }
    ],  
    wishlist: [
        { type: mongoose.Types.ObjectId, ref: 'products' }
    ],
    orders: [
        {
            products: [{ type: mongoose.Types.ObjectId, ref: 'products' }],
            date: Date,
            order_id: String,
            payment_id: String
        }
    ]
})

const User = mongoose.model('users', UserSchema)


module.exports = User